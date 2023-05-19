import { watchConfigFiles } from './watcher.ts';

// try {
//   const config = await manager.localLoadConfig(
//     (config: BotConfig) => config.name === Deno.env.get('name'),
//   );
//   console.log(manager.getSecret('API_KEY'));
// } catch (e) {
//   console.log(e);
// }
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

// Скрипт, работающий фоном и трекающий изменения в конфиге, перестраивает схему
