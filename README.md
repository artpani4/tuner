# Tuner

[![deno.land/x/tuner](https://shield.deno.dev/x/tuner)](https://deno.land/x/tuner)

Tuner - модуль для управления конфигурациями проекта.
Данные конфигурации описываются в виде .ts файла, содержащего объект с полями и значениями.
Файлы могут храниться как в самом проекте(local файлы), так и удаленно (remote).

Фактически, модуль предоставляет класс для менеджмента файлов конфига и несколько фукнций, обновляющие схемы конфига в реальном времени для удобной отладки и разработки.

---

## Оглавление

- [Tuner](#Tuner)
  - [Оглавление](#оглавление)
  - [Использование](#использование)
    - [Схематичный пример](#схематичный-пример)
    - [Пример использования (отправка email)](#пример-использования-отправка-email)
  - [Middleware](#middleware)

## Использование

### Генерация и обновление схемы

Для более комфортого обращения с конфигурацией интерфейсы объектов с данными конфига должны быть определены. Кроме того, при изменени конфига схема должна быть автоматически переписана.

Пусть в папке config имеется файл localTelegramBotConfig.ts
Названия файлов конфигов обязательно должны заканчиваться на Config.ts

Сам объект обязан содержать поле secrtes и поле highPriority

> secrets : {name: string, value: string}[]

```ts
// config/localTelegramBotConfig.ts
const localBotConfig = {
  name: 'local',
  highPriority: true,
  secrets: [
    {
      name: 'API_KEY',
      value: 'ololo1',
    },
  ],
  telegram: {
    botToken: 'ololo',
    chatId: '123213',
    tokens: [{
      a: 10,
      b: 20,
      c: 30,
    }, {
      a: 40,
      b: 100,
      d: 500,
      f: 900,
    }],
  },
  database: {
    supaApi: 'lalala',
    username: 'ololoev',
    password: 'mmm',
  },
};

export default localBotConfig;
```

> 🚩 Аргументы-**флаги**(наличие которых само по себе влияет на логику обработчика) каждой команды описываются в виде

```ts
const argA_2: ICommandArgument = {
  name: 'argA_2',
  description: 'argA_2 description',
  type: ArgumentType.FLAG,
  required: false,
};
```

> ⚡ Сама команда собирается так

```ts
const cmdA = new CliCommandBuilder()
  .setName('cmdA')
  .setDescription('cmdA description')
  .addArgument(argA_1)
  .addArgument(argA_2)
  .addSubcommand(subA)
  .setHandler(handlerA)
  .build();
```

> 🛡️ После создания команды, ее можно добавить в _Cli_\
> При необходимости, можно добавить промежуточное программное обеспечение (middleware)

```ts
const cli = new Cli();
cli
  .addCommand(cmdA)
  .addCommand(cmdB)
  .addCommand(cmdC)
  .use(rexExpA, handlerA)
  .use(rexExpB, handlerB);
```

> 🚀 Выполнение команды происходит так

```ts
cli.execute`cmdA --argA_1 "Hello" --argA_2 150`;
```

### Пример использования (отправка email)

Команда для отправки email выглядит одним из следующих вариантов:

- _email \<email\> \<message\>_
- _email --email \<email\> --msg \<message\>_

Обработчик команды будет принимать два аргумента: _--email_ и _--msg_, затем будет "отправлять" сообщение по указанному адресу.

```ts
const emailHandler = (options: HandlerArgs) => {
  console.log(
    `Email sent to ${options['--email']} with message: ${
      options['--msg']
    }`,
  );
};
```

Добавить команду и ее аргументы можно с помощью _CommandBuilder_:

```ts
import {
  ArgumentType,
  Cli,
  CliCommandBuilder,
  HandlerArgs,
  validateFunctions,
} from '../mod.ts';

const emailCommand = new CliCommandBuilder()
  .setName('email')
  .setDescription('Send an email to a specified email address')
  .addArgument({
    name: '--email',
    description: 'The email address to send the email to',
    type: ArgumentType.OPTION,
    valueValidator: validateFunctions.emailValidate,
    required: true,
  })
  .addArgument({
    name: '--msg',
    description: 'The message to include in the email',
    type: ArgumentType.OPTION,
    required: true,
  })
  .setHandler(emailHandler)
  .build();
```

> Вместо _validateFunctions.emailValidate_ можно использовать свою функцию вида _string => boolean_

Экземпляр _Cli_ хранит все команды и промежуточное программное обеспечение. Добавить команду в _Cli_ можно с помощью метода _addCommand_, выполнить команду с помощью метода _execute_:

```ts
const cli = new Cli();
cli.addCommand(emailCommand);

await cli.execute`email example@example.com "Hello, World!"`;
```

[![Typing SVG](https://readme-typing-svg.demolab.com?font=Fira+Code&duration=2000&pause=3000&width=800&lines=Email+sent+to+example%40example.com+with+message%3A+%22Hello%2C+World!%22)](https://git.io/typing-svg)

---

[Пример](examples/commit/mod.ts) генерации коммита с помощью OpenAI API.

## Middleware

Если перед срабатыванием обработчика команды нужно дополнительно обработать запрос, можно использовать middleware-функции. Данные функции возвращают true/false. Обработчик команды срабатывает в том случае, если все middleware-функции вернули true. Если хотя бы одна из них вернула false, цепочка обработки прерывается.

```ts
//middleware.ts
const helpMiddleware = {
  pattern: / help /,
  handler: (lexemes: ILexeme[]) => {
    const toHelpCmds = lexemes.filter((lexeme) => {
      return lexeme.type === LexemeType.COMMAND;
    }).map((cmd) => cmd.content);
    console.log(`Find commands ${toHelpCmds} `);
    return false;
  },
};
```
