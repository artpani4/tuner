import { botConfigSchema } from '../config/botConfigSchema.ts';

const localBotConfig = {
  name: 'remote',
  secrets: [
    {
      name: 'API_KEY',
      value: 'ololo1',
    },
  ],
  telegram: {
    salt: 'salt2',
    chatId: '123',
    newField: 1000,
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

console.log(botConfigSchema.safeParse(localBotConfig).success);
