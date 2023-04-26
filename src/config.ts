import { ConfigManager } from './manager.ts';
import {
  BotConfig,
  BotConfigSchema,
} from '../examples/config/botConfigSchema.ts';

const manager = new ConfigManager<BotConfig, typeof BotConfigSchema>(
  BotConfigSchema,
);

manager.addRemoteConfigUrls(
  [
    '../examples/config/localBotConfig.ts',
    '../examples/config/prodBotConfig.ts',
  ],
);
manager.addLocalConfigUrl('../examples/config/localBotConfig.ts');
manager.addLocalConfigUrl('../examples/config/prodBotConfig.ts');

export default manager;
