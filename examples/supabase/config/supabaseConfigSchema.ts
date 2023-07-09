import { z } from 'https://deno.land/x/zod/mod.ts';
import { envTypes } from '../../../src/manager.ts';

//TODO научиться генеировать enum
export const supabaseConfigSchema = z.object({
  name: z.string(),
  env: z.object({
    NOTION_API_KEY: z.object({
      type: z.enum([
        envTypes.string,
        envTypes.number,
        envTypes.boolean,
      ]),
    }),
    GITHIUB_API_KEY: z.object({
      type: z.enum([
        envTypes.string,
        envTypes.number,
        envTypes.boolean,
      ]),
    }),
  }),
  timeoutToUpdate: z.number(),
  mainTable: z.string(),
  isSubscribtionOn: z.boolean(),
});

export type SupabaseConfig = z.infer<typeof supabaseConfigSchema>;

//├─ name
//├─ env
//│  ├─ NOTION_API_KEY
//│  │  └─ type
//│  └─ GITHIUB_API_KEY
//│     └─ type
//├─ timeoutToUpdate
//├─ mainTable
//└─ isSubscribtionOn
//
