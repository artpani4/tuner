import { getNotionConfig } from '../integrations/notion.ts';
import {
  BotConfig,
  botConfigSchema,
} from '../config/botConfigSchema.ts';
import { ConfigManager } from './mod.ts';
import { getSecret } from './manager.ts';
import { getGitHubConfig } from '../integrations/github.ts';

const manager = new ConfigManager<BotConfig, typeof botConfigSchema>(
  botConfigSchema,
);

manager.addLocalConfigPath('config/localBotConfig.ts');

manager.addRemoteProSource(async () => {
  return await getNotionConfig(
    getSecret('NOTION_KEY'),
    '9a4e81da0d324cd9b9e5ebb2b92c4f71',
  );
});

manager.addRemoteProSource(async () => {
  return await getGitHubConfig(
    getSecret('GITHUB_KEY'),
    'artpani4',
    'configTest',
    'configTest.ts',
  );
});
// await manager.setMainConfig('config/localBotConfig.ts', 'local');
export default manager;
