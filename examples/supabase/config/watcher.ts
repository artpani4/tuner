import { ConfigFilePaths, watchConfigFiles } from '../../../mod.ts';

const configFilePaths: ConfigFilePaths = {
  filePaths: [
    'examples/supabase/config/localConfig.ts',
    'examples/supabase/config/prodConfig.ts',
  ],
  configType: 'supabaseConfig',
};

await watchConfigFiles(configFilePaths);
