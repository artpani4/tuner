# Tuner

[![deno.land/x/tuner](https://shield.deno.dev/x/tuner)](https://deno.land/x/tuner) [![JSR Score](https://jsr.io/badges/@artpani/tuner/score)](https://jsr.io/@vseplet/reface)

Tuner - модуль для управления конфигурациями проекта. Данные конфигурации описываются в виде **.ts** файла с экспортируемым объектом, который содержит перечисление _env_ переменных и полей конфига. Конфиги могут образовывать иерархию, наследуясь от родительских и перезаписываясь дочерними.

---

## Оглавление

- [Tuner](#tuner)
  - [Оглавление](#оглавление)
  - [Простейший конфиг](#простейший-конфиг)
  - [Конфиг с описанием env-переменных](#конфиг-с-описанием-env-переменных)
  - [Объединение конфигов](#объединение-конфигов)
  - [Опции при загрузке](#опции-при-загрузке)

## Простейший конфиг

Минимально конфиг может быть описан так:

```tsx
// ./config/myConfig.tuner.ts
import Tuner from 'jsr:@artpani/tuner';

export default Tuner.tune(
  {
    data: {
      field1: 'value1',
      field2: 100,
      field3: true,
      field4: ['минималистично', 'удобно', 'не правда ли?'],
    },
  },
);

export default myCfg;
export type MyCFGType = typeof myCfg;
```

> Функция _tune_ заботливо подскажет структуру ожидаемого объекта

Загрузка конфига и использование происходит так:

```tsx
// ./main.ts
import Tuner from 'jsr:@artpani/tuner';
import { MyCFGType } from '../config/myConfig.tuner.ts';
const cfg = await Tuner.use.loadConfig<MyCFGType>({
  configDirPath: 'config',
});
console.log(cfg.data.field2); // 100
```

__При запуске обязательно наличие _env_ переменной _CONFIG_, ее значение - название файла конфига до _.tuner.ts,__ в данном примере это myConfig._

```bash
CONFIG=myConfig deno run --allow-all main.ts
```

## Конфиг с описанием env-переменных

В Tuner имеется возможность описать типы переменных окружения и поведения при их отсутствии:

- значение по умолчанию
- завершение процесса
- генерация исключения
- вычисление на лету

Например, так:

```tsx
// ./config/myConfig.tuner.ts
import Tuner from 'jsr:@artpani/tuner';
export default Tuner.tune(
  {
    env: {
      // Использовать Значение по умолчанию
      env1: Tuner.Env.getString.orDefault('defalut value1'),
      env2: Tuner.Env.getNumber.orDefault(100),
      env3: Tuner.Env.getBoolean.orDefault(true),
      // Проигнорировать отсуствие переменной(будет иметь тип значения + undefined)
      env4: Tuner.Env.getString.orNothing(),
      env5: Tuner.Env.getNumber.orNothing(),
      env6: Tuner.Env.getBoolean.orNothing(),
      // Завершенить процесс
      env7: Tuner.Env.getString.orExit(
        'сообщение об ошибке, необязательно',
      ),
      env8: Tuner.Env.getNumber.orExit(
        'выведет в консоль перед выходом',
      ),
      env9: Tuner.Env.getBoolean.orExit(),
      // Сгенерировать исключение
      env10: Tuner.Env.getString.orThrow(new Error('ошибка')),
      env11: Tuner.Env.getNumber.orThrow(new Error()),
      env12: Tuner.Env.getBoolean.orThrow(new Error()),
      // Вычисленить данных по переданному колбэку
      //(может быть асинхронным, если данные нужно получить с диска или удаленно, например)
      env13: Tuner.Env.getString.orCompute(() => 'computed value1'),
      env14: Tuner.Env.getNumber.orAsyncCompute(() =>
        new Promise(() => 100)
      ),
    },
    data: {
      field1: 'value1',
      field2: 100,
      field3: true,
      field4: ['минималистично', 'удобно', 'не правда ли?'],
    },
  },
);
```

> **Разумеется, можно просто указать значение-примитив, вроде env1: 100**

## Объединение конфигов

Tuner позволяет “собрать” конфиг, используя другие конфиги, нужно только выстроить из них цепочку:

- Текущий конфиг дополнится всеми полями родительского, при этом сохранит свои значения
- Текущий конфиг дополнится всеми полями дочернего, при этом совпадающие поля будут переписаны значениями из дочернего конфига
- Значения-фукнции, используемые для описания env-переменных также подчиняются этим правилам

![Пример наследования](https://artpani.sirv.com/Images/projects/tuner/cascade.png)

> При этом, например, конфигу В необязательно указывать А в качестве родительского.

Реализация:

```tsx
// config/develop.tuner.ts
import Tuner from 'jsr:@artpani/tuner';
import { ACfgType } from './a.tuner.ts';

const developCfg = Tuner.tune({
  parent: Tuner.Load.local.configDir<ACfgType>('a.tuner.ts'),
  data: {
    a: 300,
    b: 301,
  },
});

export default developCfg;
export type DevelopCFGType = typeof developCfg;

// config/base.tuner.ts
import Tuner from 'jsr:@artpani/tuner';

const baseCfg = Tuner.tune({
  data: {
    a: 400,
    b: 401,
    c: 402,
  },
});

export default baseCfg;
export type BaseCFGType = typeof baseCfg;

// config/a.tuner.ts
import Tuner from 'jsr:@artpani/tuner';
import { BaseCFGType } from './base.tuner.ts';

const aCfg = Tuner.tune({
  parent: Tuner.Load.local.configDir<BaseCFGType>('base.tuner.ts'),
  child: Tuner.Load.local.configDir('b.tuner.ts'),
  data: {
    b: 200,
    e: 201,
  },
});

export default aCfg;
export type ACfgType = typeof aCfg;

// config/b.tuner.ts
import Tuner from 'jsr:@artpani/tuner';

const bCfg = Tuner.tune({
  data: {
    a: 100,
    d: 101,
  },
});

export default bCfg;
export type BCfgType = typeof bCfg;

// main.ts
import { DevelopCFGType } from './config/develop.tuner.ts';
import Tuner from 'jsr:@artpani/tuner';

const config = await Tuner.use.loadConfig<DevelopCFGType>({
  configDirPath: './config',
});

console.log(config.data);
// { a: 300, b: 301, c: 402, e: 201, d: 101 }
```

## Опции при загрузке

При вызове loadConfig, передайте объект с опциями, чтобы настроить процесс загрузки конфигураций:

- _configDirName_: Имя директории, где хранятся конфигурационные файлы. **По умолчанию используется config**. Укажите это значение, если у вас другая структура каталогов.

- _configDirPath_: Путь к директории, содержащей конфигурационные файлы. **По умолчанию это текущая рабочая директория (./)**. Используйте эту опцию, если конфигурационные файлы находятся в другом месте.
