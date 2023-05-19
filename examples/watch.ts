import { watchConfigFiles } from '../src/watcher.ts';

const configFilePaths = [
  {
    filePath: 'config/localBotConfig.ts',
    configType: 'botConfig',
  },
  {
    filePath: 'config/masterBotConfig.ts',
    configType: 'botConfig',
  },
];

await watchConfigFiles(configFilePaths);
