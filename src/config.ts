// import {
//   BotConfig,
//   BotConfigSchema,
// } from '../examples/config/botConfigSchema.ts';
// import { ConfigManager } from './manager.ts';

import {
  BotConfig,
  botConfigSchema,
} from '../config/botConfigSchema.ts';
import { ConfigManager } from './mod.ts';

const manager = new ConfigManager<BotConfig, typeof botConfigSchema>(
  botConfigSchema,
);

manager.addRemoteConfigUrls(
  [
    'config/localBotConfig.ts',
  ],
);
manager.addLocalConfigUrl('config/localBotConfig.ts');

export default manager;
