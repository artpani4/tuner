import { z } from 'https://deno.land/x/zod/mod.ts';

export const BotConfigSchema = z.object({
  env: z.string(),
  telegram: z.object({
    botToken: z.string(),
    chatId: z.string(),
  }),
  database: z.object({
    host: z.string(),
    port: z.number(),
    database: z.string(),
    username: z.string(),
    password: z.string(),
  }),
});

export type BotConfig = z.infer<typeof BotConfigSchema>;
