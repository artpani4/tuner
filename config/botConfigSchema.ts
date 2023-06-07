import { z } from 'https://deno.land/x/zod/mod.ts';

export const botConfigSchema = z.object({
  name: z.string(),
  secrets: z.array(z.object({
  name: z.string()
})),
  pageNotion: z.string(),
  codeBlockId: z.string()
})

export type BotConfig = z.infer<typeof botConfigSchema>;

//├─ name
//├─ secrets
//│  └─ 0
//│     └─ name
//├─ pageNotion
//└─ codeBlockId
//