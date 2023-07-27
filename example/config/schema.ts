import { z } from 'https://deno.land/x/zod/mod.ts';

export const configSchema = z.object({
  env: z.object({
  PORT: z.number(),
  HOST: z.string(),
  SOME_KEY: z.string(),
  DEVELOP_PARENT_SOME_KEY: z.string(),
  DEBUG: z.boolean(),
  BOT_API_KEY: z.string()
}),
  config: z.object({
  featureCommon: z.object({
  valueBase: z.boolean(),
  x: z.number(),
  developParentFeatureA: z.string(),
  y: z.string(),
  z: z.array(z.string())
}),
  featureB: z.object({
  valueBase: z.number()
}),
  someUrl: z.string(),
  featureDevelopParent: z.object({
  r: z.number()
}),
  loggingLevel: z.string(),
  someProp: z.string(),
  featureDevelop: z.object({
  enableDevelop: z.boolean(),
  xDevelop: z.number(),
  yDevelop: z.string(),
  zDevelop: z.array(z.any())
}),
  logfareHost: z.string(),
  someValueNotion: z.string()
})
})

export type Config = z.infer<typeof configSchema>;

//├─ env
//│  ├─ PORT
//│  ├─ HOST
//│  ├─ SOME_KEY
//│  ├─ DEVELOP_PARENT_SOME_KEY
//│  ├─ DEBUG
//│  └─ BOT_API_KEY
//└─ config
//   ├─ featureCommon
//   │  ├─ valueBase
//   │  ├─ x
//   │  ├─ developParentFeatureA
//   │  ├─ y
//   │  └─ z
//   │     └─ 0
//   ├─ featureB
//   │  └─ valueBase
//   ├─ someUrl
//   ├─ featureDevelopParent
//   │  └─ r
//   ├─ loggingLevel
//   ├─ someProp
//   ├─ featureDevelop
//   │  ├─ enableDevelop
//   │  ├─ xDevelop
//   │  ├─ yDevelop
//   │  └─ zDevelop
//   ├─ logfareHost
//   └─ someValueNotion
//