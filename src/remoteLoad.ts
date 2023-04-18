import { BotConfig } from '../examples/config/botConfigSchema.ts';
import manager from './config.ts';

try {
  const config = await manager.remoteLoadConfig(
    (config: BotConfig) => config.env === Deno.env.get('BOT_ENV'),
  );
  console.log(config);
} catch (e) {
  console.log(e);
}
