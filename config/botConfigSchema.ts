import { z } from 'https://deno.land/x/zod/mod.ts';

export const botConfigSchema = z.object({
  name: z.string(),
  secrets: z.array(z.object({
  name: z.string()
})),
  telegram: z.object({
  salt: z.string(),
  chatId: z.string(),
  newField: z.number(),
  tokens: z.array(z.union([z.object({
  a: z.number(),
  b: z.number(),
  c: z.number()
}),z.object({
  a: z.number(),
  b: z.number(),
  d: z.number(),
  f: z.number()
})]))
}),
  database: z.object({
  supaApi: z.string(),
  username: z.string(),
  password: z.string()
})
})

export type BotConfig = z.infer<typeof botConfigSchema>;

//├─ name
//├─ secrets
//│  └─ 0
//│     └─ name
//├─ telegram
//│  ├─ salt
//│  ├─ chatId
//│  ├─ newField
//│  └─ tokens
//│     ├─ 0
//│     │  ├─ a
//│     │  ├─ b
//│     │  └─ c
//│     └─ 1
//│        ├─ a
//│        ├─ b
//│        ├─ d
//│        └─ f
//└─ database
//   ├─ supaApi
//   ├─ username
//   └─ password
//