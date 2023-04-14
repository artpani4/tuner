import { loadConfig } from '../ConfigLoader/localLoader.ts';
import {
  BotConfig,
  BotConfigSchema,
} from '../examples/config/botConfigSchema.ts';

const config = await loadConfig<BotConfig>(
  BotConfigSchema,
  (config: BotConfig) => config.env === 'LOCAL',
);

console.log(config);
