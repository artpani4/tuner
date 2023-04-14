import { loadConfig } from '../ConfigLoader/localLoader.ts';
import {
  BotConfig,
  BotConfigSchema,
} from '../examples/config/botConfigSchema.ts';

const config = await loadConfig<BotConfig>(
  BotConfigSchema,
  (config: BotConfig) => config.env === Deno.env.get('BOT_ENV'),
);

// BOT_ENV=LOCAL deno run --allow-read --allow-env src/index.ts

console.log(config);
