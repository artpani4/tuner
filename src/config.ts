import {
  BotConfig,
  BotConfigSchema,
} from '../examples/config/botConfigSchema.ts';
import { ConfigManager } from './manager.ts';

const manager = new ConfigManager<BotConfig, typeof BotConfigSchema>(
  BotConfigSchema,
);

manager.addRemoteConfigUrls(
  [
    '../examples/config/localBotConfig.ts',
  ],
);
manager.addLocalConfigUrl('examples/config/localBotConfig.ts');

export default manager;
