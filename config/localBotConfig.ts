// import { BotConfig } from './botConfigSchema.ts';

import { BotConfig } from './botConfigSchema.ts';

const localBotConfig: BotConfig = {
  name: 'local',
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
