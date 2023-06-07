import {
  SupabaseConfig,
  supabaseConfigSchema,
} from '../config/supabaseConfigSchema.ts';
import { ConfigManager } from '../../../mod.ts';
import { getNotionConfig } from '../../../integrations/notion.ts';
import { getSecret } from '../../../src/mod.ts';
import { getGitHubConfig } from '../../../integrations/github.ts';

const manager = new ConfigManager<
  SupabaseConfig,
  typeof supabaseConfigSchema
>(
  supabaseConfigSchema,
);

// Добавление одного удаленного конфига
manager.addRemoteConfigUrl(
  'https://raw.githubusercontent.com/artpani4/configTest/main/configTest.ts',
);

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

export default manager;
