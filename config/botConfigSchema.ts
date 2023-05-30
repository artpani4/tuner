import { z } from 'https://deno.land/x/zod/mod.ts';

export const botConfigSchema = z.object({
  name: z.string(),
  secrets: z.array(z.object({
  name: z.string(),
  value: z.string()
})),
  telegram: z.object({
  botToken: z.string(),
  chatId: z.string(),
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
//│     ├─ name
//│     └─ value
//├─ telegram
//│  ├─ botToken
//│  ├─ chatId
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