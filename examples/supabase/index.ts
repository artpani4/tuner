import manager from './config/manager.ts';
import { SupabaseConfig } from './config/supabaseConfigSchema.ts';

const config = await manager.loadConfig((config: SupabaseConfig) =>
  config?.name === Deno.env.get('name')
);

console.log(config);

// name=local deno run --allow-all examples/supabase/index.ts
