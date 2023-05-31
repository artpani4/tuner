import { BotConfig } from '../config/botConfigSchema.ts';
import manager from './config.ts';

try {
  const config = await manager.localLoadConfig(
    (config: BotConfig) => config.name === Deno.env.get('name'),
  );
  console.log(manager.getSecret('API_KEY'));
  console.log(config);
} catch (e) {
  console.log(e);
}

// await watchConfigFiles(configFilePaths);

// Скрипт, работающий фоном и трекающий изменения в конфиге, перестраивает схему
