# Tuner

[![deno.land/x/tuner](https://shield.deno.dev/x/tuner)](https://deno.land/x/tuner)

Tuner - модуль для управления конфигурациями проекта.
Данные конфигурации описываются в виде .ts файла, содержащего объект с полями и значениями.
Файлы могут храниться как в самом проекте(local файлы), так и удаленно (remote).

Фактически, модуль предоставляет класс для менеджмента файлов конфига и несколько фукнций, обновляющие схемы конфига в реальном времени для удобной отладки и разработки.

---

## Оглавление

- [Tuner](#tuner)
  - [Оглавление](#оглавление)
  - [Использование](#использование)
    - [Генерация и обновление схемы](#генерация-и-обновление-схемы)
    - [Создание менеджера конфигов](#создание-менеджера-конфигов)
    - [Использование менеджера конфигов](#использование-менеджера-конфигов)

## Использование

### Генерация и обновление схемы

Для более комфортого обращения с конфигурацией интерфейсы объектов с данными конфига должны быть определены. Кроме того, при изменени конфига схема должна быть автоматически переписана.

Пусть в папке config имеется файл localSupabaseConfig.ts
Требований к названию файлов конфига нет.

Сам объект обязан содержать поле secrets с указанием названий секретных переменных.

> secrets : {name: string}[]

```ts
// config/localSupabaseConfig.ts
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
  timeout: 200,
  mainTable: 'customer',
  otherKey: 'otherValue',
};

export default localSupabase;
```

Для генерации схемы и типа этого объекта, а также отслеживания изменений этого файла используется watchConfigFiles:

```ts
// config/watcher.ts
import { watchConfigFiles } from 'https://deno.land/x/tuner/mod.ts';

const configFilePaths: ConfigFilePaths = {
  // Пути до файлов конфига типа supabaseConfig
  filePaths: [
    'config/localSupabaseConfig.ts',
    'config/stageSupabaseConfig.ts',
    'config/prodSupabaseConfig.ts',
  ],
  configType: 'supabaseConfig',
};

await watchConfigFiles(configFilePaths);
```

При запуске deno run --allow-all config/watcher.ts каждое измение любого из отслеживаемых файлов изменяет схему конфига(или генерирует ее при первом запуске/отсутствии файла схемы)

Файл схемы конфига расположен в той же директории с названием ${configType}Schema.ts

> Выведенный тип и его импорт автоматически впишется в config/localSupabaseConfig.ts, ...

### Создание менеджера конфигов

```ts
// config/manager.ts
import {
  SupabaseConfig,
  SupabaseConfigSchema,
} from '../config/supabaseConfigSchema.ts';
import { ConfigManager } from 'https://deno.land/x/tuner/mod.ts';

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
manager.addRemoteConfigUrls(
  'https://raw.githubusercontent.com/artpani4/configTest/main/configTest.ts',
  'http://example.com/supabaseConfigRu.ts',
  'http://example.com/supabaseConfigEn.ts',
);

// Добавление одного локального конфига
manager.addLocalConfigUrl('config/localSupabaseConfig.ts.ts');

// Добавление несокльких локальных конфигов
manager.addLocalConfigUrls([
  'config/localSupabaseConfig.ts',
  'config/stageSupabaseConfig.ts',
  'config/prodSupabaseConfig.ts',
]);

// Если проийзодет какая-то ошибка при подгрузке какого-то из конфигов, то данный конфиг загрузится по умолчанию
// Если проблема возникнет и с ним(или же конфига по умолчанию нет, а целевой конфиг недоступен) сработать исключение.
await manager.setMainConfig('config/localBotConfig.ts', 'local');
export default manager;
```

### Использование менеджера конфигов

```ts
// src/index.ts
import { SupabaseConfig } from '../config/supabaseConfigSchema.ts';
import manager from '../config/manager.ts';

try {
  // Аргументом является предикат, который представляет собой функцию для фильтрации конфигов.
  // В данном случае, функция проверяет, равно ли поле 'name' в конфигурации значению,  полученному из переменной окружения 'name'.
  const config = await manager.loadConfig(
    (config: SupabaseConfig) => config.name === Deno.env.get('name'),
  );
  console.log(config);
  // Извлечение сикретов
  const dbApiKey = manager.getSecret('API_KEY');
  const dbUrl = manager.getSecret('URL');
} catch (e) {
  console.log(e);
}
```
