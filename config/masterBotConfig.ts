// import { BotConfig } from './botConfigSchema.ts';

import { BotConfig } from './botConfigSchema.ts';

const localBotConfig: BotConfig = {
  name: 'master',
  secrets: [
    {
      name: 'API_KEY',
      value: 'ololo2',
    },
  ],
  telegram: {
    botToken: 'ololo',
    chatId: '999999',
  },
  database: {
    supaApi: 'pppp',
    username: 'ololoev',
    password: 'mmm',
  },
};

export default localBotConfig;
