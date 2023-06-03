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
    'https://raw.githubusercontent.com/artpani4/configTest/main/configTest.ts',
  ],
);
manager.addLocalConfigUrl('config/localBotConfig.ts');
await manager.setMainConfig('config/localBotConfig.ts', 'local');
export default manager;
