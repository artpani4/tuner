import { BotConfig } from './botConfigSchema.ts';

const prodBotConfig: BotConfig = {
  env: 'PROD',
  telegram: {
    botToken: 'prod',
    chatId: 'prod',
  },
  database: {
    host: 'prod',
    port: 1488,
    database: 'supabase',
    username: 'prod',
    password: 'prod',
  },
};

export default prodBotConfig;
