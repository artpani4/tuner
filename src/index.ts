import { BotConfig } from '../examples/config/botConfigSchema.ts';
import manager from './config.ts';

try {
  const config = await manager.localLoadConfig(
    (config: BotConfig) => config.name === Deno.env.get('name'),
  );
  console.log(config);
} catch (e) {
  console.log(e);
}
