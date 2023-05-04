import { generateSchema } from '../../schema/generator.ts';
import { BotConfig } from './botConfigSchema.ts';

const localBotConfig: BotConfig = {
  name: 'LOCAL',
  secrets: [
    {
      name: 'API_KEY',
      value: '',
    },
  ],
  telegram: {
    botToken: 'ololo',
    chatId: '123213',
  },
  database: {
    host: 'trololo',
    port: 1488,
    database: 'trololo',
    username: 'ololoev',
    password: 'mmm',
  },
};

export default localBotConfig;

// //Вызвал после того, как прописал конфиг
// await generateSchema(
//   localBotConfig,
//   'BotConfig',
//   'examples/config/botConfigSchema.ts',
// );
