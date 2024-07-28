import { z } from 'https://deno.land/x/zod/mod.ts';

export const configSchema = z.object({
  config: z.object({
    a: z.number(),
    d: z.number(),
    CONFIG_B: z.boolean(),
    test: z.number(),
    develop: z.boolean(),
    b: z.number(),
    e: z.number(),
    f: z.number(),
    CONFIG_A: z.boolean(),
    CONFIG_NOTION: z.boolean(),
  }),
  watch: z.number(),
  env: z.object({
    someField: z.string(),
  }),
});

export type Config = z.infer<typeof configSchema>;
