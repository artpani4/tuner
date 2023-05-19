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
  },
  database: {
    supaApi: 'lalala',
    username: 'ololoev',
    password: 'mmm',
  },
};

export default localBotConfig;
