# Tuner

[![deno.land/x/tuner](https://shield.deno.dev/x/tuner)](https://deno.land/x/tuner)

Tuner - модуль для управления конфигурациями проекта.
Данные конфигурации описываются в виде .ts файла, содержащего объект с полями и значениями.
Файлы могут храниться как в самом проекте(local файлы), так и удаленно (remote).
Притом доступ к удаленным файлам можно осуществлять непосредственно передавая путь, либо прописать колбэк-фукнцию, которая извлекает нужные данные.

Фактически, модуль предоставляет класс для менеджмента файлов конфига и несколько фукнций, обновляющие схемы конфига в реальном времени для удобной отладки и разработки.

---

## Оглавление

- [Tuner](#tuner)
  - [Оглавление](#оглавление)
  - [Генерация и обновление схемы](#-генерация-и-обновление-схемы)
  - [Создание менеджера конфигов](#-создание-менеджера-конфигов)
  - [Использование менеджера конфигов](#-использование-менеджера-конфигов)
  - [Поддерживаемые сервисы](#-поддерживаемые-сервисы)

## <img width="30" height="30" src="https://img.icons8.com/ultraviolet/40/sprout.png" alt="sprout"/> Генерация и обновление схемы

Для более комфортого обращения с конфигурацией интерфейсы объектов с данными конфига должны быть определены. Кроме того, при изменени конфига схема должна быть автоматически переписана.

Пусть в папке _config_ имеется файл _localConfig.ts_

> Требований к названию файлов конфига нет.

Сам объект обязан содержать поле secrets с указанием названий секретных переменных.

> secrets : {name: string}[]

```ts
// config/localConfig.ts
const localSupabase = {
  name: 'local',
  secrets: [
    {
      name: 'API_KEY',
    },
    {
      name: 'URL',
    },
  ],
  timeoutToUpdate: 200,
  mainTable: 'Wallets',
  isSubscribtionOn: true,
};

export default localSupabase;
```

Для генерации схемы и типа этого объекта, а также отслеживания изменений этого файла используется _watchConfigFiles_:

```ts
// config/watcher.ts
import { watchConfigFiles } from 'https://deno.land/x/tuner/mod.ts';

const configFilePaths: ConfigFilePaths = {
  filePaths: [
    'config/localConfig.ts',
    'config/prodConfig.ts',
  ],
  configType: 'supabaseConfig',
};

await watchConfigFiles(configFilePaths);
```

При запуске **deno run --allow-all config/watcher.ts** каждое измение любого из отслеживаемых файлов изменяет схему конфига(или генерирует ее при первом запуске/отсутствии файла схемы)

Файл схемы конфига расположен в той же директории с названием _${configType}Schema.ts_

> Выведенный тип и его импорт автоматически впишется в config/localConfig.ts, ...

## <img width="30" height="30" src="https://img.icons8.com/ultraviolet/40/hammer.png" alt="hammer"/> Создание менеджера конфигов

```ts
// config/manager.ts
import {
  SupabaseConfig,
  SupabaseConfigSchema,
} from '../config/supabaseConfigSchema.ts';
import {
  ConfigManager,
  getNotionConfig,
} from 'https://deno.land/x/tuner/mod.ts';

const manager = new ConfigManager<
  SupabaseConfig,
  typeof SupabaseConfigSchema
>(
  SupabaseConfigSchema,
);

// Добавление одного удаленного конфига
manager.addRemoteConfigUrl(
  'https://raw.githubusercontent.com/artpani4/configTest/main/configTest.ts',
);

// Добавление нескольких удаленных конфигов
manager.addRemoteConfigUrls([
  'http://example.com/supabaseConfigRu.ts',
  'http://example.com/supabaseConfigEn.ts',
]);

// Добавление одного локального конфига
manager.addLocalConfigUrl('config/localConfig.ts');

// Добавление несокльких локальных конфигов
manager.addLocalConfigUrls([
  'config/localConfig.ts',
  'config/prodConfig.ts',
]);

// Передаем callback, который возвращет строку с объектом
// В данном случае getNotionConfig(key: string, blockId: string): Promise<string>
manager.addRemoteProSource(async () => {
  return await getNotionConfig(
    getSecret('NOTION_KEY'),
    'blockID',
  );
});

// Если проийзодет какая-то ошибка при подгрузке какого-то из конфигов, то данный конфиг загрузится по умолчанию
// Если проблема возникнет и с ним(или же конфига по умолчанию нет, а целевой конфиг недоступен) сработать исключение.
await manager.setMainConfig('config/localConfig.ts', 'local');
export default manager;
```

> Конфиги, которые добавляются методами **.addRemoteConfigUrl** и **.addRemoteConfigUrls** прописываются таким же образом, как и локальные конфиги
>
> Конфиги, подключаемые через **.addRemoteProSource** описываются без const ..., только сам объект конфига.

```ts
// Конфиг будет подключен через addRemoteConfigUrl
const prodSupabase = {
  name: 'gitRaw',
  secrets: [
    {
      name: 'API_KEY',
    },
    {
      name: 'URL',
    },
  ],
  timeoutToUpdate: 100,
  mainTable: 'Invoices',
  isSubscribtionOn: false,
};

export default prodSupabase;

// Конфиг будет подключен через .addRemoteProSource
{
  name: 'notion',
  secrets: [
    {
      name: 'API_KEY',
    },
    {
      name: 'URL',
    },
  ],
  timeoutToUpdate: 3000,
  mainTable: 'Notion',
  isSubscribtionOn: true,
};
```

## <img width="30" height="30" src="https://img.icons8.com/ultraviolet/40/rocket.png" alt="rocket"/> Использование менеджера конфигов

```ts
// src/index.ts
import { SupabaseConfig } from '../config/supabaseConfigSchema.ts';
import manager from '../config/manager.ts';
import { getSecret } from 'https://deno.land/x/tuner/mod.ts';

try {
  // Аргументом является предикат, который представляет собой функцию для фильтрации конфигов.
  // В данном случае, функция проверяет, равно ли поле 'name' в конфигурации значению,  полученному из переменной окружения 'name'.
  const config = await manager.loadConfig(
    (config: SupabaseConfig) => config.name === Deno.env.get('name'),
  );
  console.log(config);
  // Извлечение сикретов
  const dbApiKey = getSecret('API_KEY');
  const dbUrl = getSecret('URL');
} catch (e) {
  console.log(e);
}
```

При запуске сикреты можно передать непосредственно

```bash
API_KEY=your_key URL=https://your_db_url.supabase.co deno run --allow-all index.ts
```

Либо создать файл .env

```env
API_KEY=your_key
URL=https://your_db_url.supabase.co
```

Если сикрет не находится, генерируется исключение.

## <img width="30" height="30" src="https://img.icons8.com/ultraviolet/40/puzzle.png" alt="puzzle"/> Поддерживаемые сервисы

Добавление колбэка для подгрузки конфига ситуативно, но бывает полезно во многих случаях.

На данный момент доступны интеграции с:

- Notion(блок **/code**)
- GitHub(файл в репозитории)

```ts
// Notion
// blockId расположен после # в ссылке на блок
getNotionConfig(key: string, blockId: string)

// GihHub
getGitHubConfig(
  apiKey: string,
  owner: string,
  repo: string,
  filePath: string,
)
```
