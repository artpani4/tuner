import { z } from 'https://deno.land/x/zod/mod.ts';

export const configSchema = z.object({
  config: z.object({
    a: z.number(),
    b: z.number(),
    c: z.number(),
    e: z.number(),
    d: z.number(),
  }),
  env: z.object({
    someField: z.number(),
  }),
});

export type Config = z.infer<typeof configSchema>;

//├─ config
//│  ├─ a
//│  ├─ b
//│  ├─ c
//│  ├─ e
//│  └─ d
//└─ env
//   └─ someField
//
