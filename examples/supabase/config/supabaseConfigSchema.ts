import { z } from 'https://deno.land/x/zod/mod.ts';

export const supabaseConfigSchema = z.object({
  name: z.string(),
  secrets: z.array(z.object({
  name: z.string()
})),
  timeoutToUpdate: z.number(),
  mainTable: z.string(),
  isSubscribtionOn: z.boolean()
})

export type SupabaseConfig = z.infer<typeof supabaseConfigSchema>;

//├─ name
//├─ secrets
//│  ├─ 0
//│  │  └─ name
//│  └─ 1
//│     └─ name
//├─ timeoutToUpdate
//├─ mainTable
//└─ isSubscribtionOn
//