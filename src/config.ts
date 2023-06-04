// import {
//   BotConfig,
//   BotConfigSchema,
// } from '../examples/config/botConfigSchema.ts';
// import { ConfigManager } from './manager.ts';
import { config as dotenvConfig } from 'https://deno.land/x/dotenv/mod.ts';

import {
  BotConfig,
  botConfigSchema,
} from '../config/botConfigSchema.ts';
import { ConfigManager } from './mod.ts';
import { getNotionConfig } from '../examples/notion.ts';
import { getSecret } from './manager.ts';

const manager = new ConfigManager<BotConfig, typeof botConfigSchema>(
  botConfigSchema,
);

// manager.addRemoteConfigUrls(
//   [
//     'https://raw.githubusercontent.com/artpani4/configTest/main/configTest.ts',
//   ],
// );
manager.addLocalConfigPath('config/localBotConfig.ts');

manager.addRemoteProSource(async () => {
  return await getNotionConfig(
    getSecret('NOTION_KEY'),
    '9a4e81da0d324cd9b9e5ebb2b92c4f71',
  );
});
// await manager.setMainConfig('config/localBotConfig.ts', 'local');
export default manager;
