import { z } from 'https://deno.land/x/zod/mod.ts';

export const blockSchema = z.object({
  object: z.string(),
  id: z.string(),
  parent: z.object({
    type: z.string(),
    page_id: z.string(),
  }),
  created_time: z.string(),
  last_edited_time: z.string(),
  created_by: z.object({
    object: z.string(),
    id: z.string(),
  }),
  last_edited_by: z.object({
    object: z.string(),
    id: z.string(),
  }),
  has_children: z.boolean(),
  archived: z.boolean(),
  type: z.string(),
  code: z.object({
    caption: z.array(z.any()),
    rich_text: z.array(z.object({
      type: z.string(),
      text: z.object({
        content: z.string(),
        link: z.literal(null),
      }),
      annotations: z.object({
        bold: z.boolean(),
        italic: z.boolean(),
        strikethrough: z.boolean(),
        underline: z.boolean(),
        code: z.boolean(),
        color: z.string(),
      }),
      plain_text: z.string(),
      href: z.literal(null),
    })),
    language: z.string(),
  }),
});

export type Block = z.infer<typeof blockSchema>;

//├─ object
//├─ id
//├─ parent
//│  ├─ type
//│  └─ page_id
//├─ created_time
//├─ last_edited_time
//├─ created_by
//│  ├─ object
//│  └─ id
//├─ last_edited_by
//│  ├─ object
//│  └─ id
//├─ has_children
//├─ archived
//├─ type
//└─ code
//   ├─ caption
//   ├─ rich_text
//   │  └─ 0
//   │     ├─ type
//   │     ├─ text
//   │     │  ├─ content
//   │     │  └─ link
//   │     ├─ annotations
//   │     │  ├─ bold
//   │     │  ├─ italic
//   │     │  ├─ strikethrough
//   │     │  ├─ underline
//   │     │  ├─ code
//   │     │  └─ color
//   │     ├─ plain_text
//   │     └─ href
//   └─ language
//
