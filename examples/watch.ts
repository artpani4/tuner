import {
  ConfigFilePaths,
  watchConfigFiles,
} from '../src/localWatch.ts';

const configFilePaths: ConfigFilePaths = {
  filePaths: ['config/localBotConfig.ts', 'config/prodBotConfig.ts'],
  configType: 'botConfig',
};

await watchConfigFiles(configFilePaths);
