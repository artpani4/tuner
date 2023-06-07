import { z } from 'https://deno.land/x/zod/mod.ts';

export const githubResSchema = z.object({
  status: z.number(),
  statusText: z.string(),
  data: z.object({
  name: z.string(),
  path: z.string(),
  sha: z.string(),
  size: z.number(),
  url: z.string(),
  html_url: z.string(),
  git_url: z.string(),
  download_url: z.string(),
  type: z.string(),
  content: z.string(),
  encoding: z.string(),
  _links: z.object({
  self: z.string(),
  git: z.string(),
  html: z.string()
})
}),
  headers: z.object({
  
}),
  config: z.object({
  url: z.string(),
  baseURL: z.literal(null),
  method: z.string(),
  headers: z.object({
  Authorization: z.string()
}),
  params: z.object({
  
}),
  data: z.literal(null),
  timeout: z.literal(null),
  withCredentials: z.literal(null),
  auth: z.literal(null),
  paramsSerializer: z.literal(null),
  redirect: z.literal(null),
  responseType: z.string()
})
})

export type GithubRes = z.infer<typeof githubResSchema>;

//├─ status
//├─ statusText
//├─ data
//│  ├─ name
//│  ├─ path
//│  ├─ sha
//│  ├─ size
//│  ├─ url
//│  ├─ html_url
//│  ├─ git_url
//│  ├─ download_url
//│  ├─ type
//│  ├─ content
//│  ├─ encoding
//│  └─ _links
//│     ├─ self
//│     ├─ git
//│     └─ html
//├─ headers
//└─ config
//   ├─ url
//   ├─ baseURL
//   ├─ method
//   ├─ headers
//   │  └─ Authorization
//   ├─ params
//   ├─ data
//   ├─ timeout
//   ├─ withCredentials
//   ├─ auth
//   ├─ paramsSerializer
//   ├─ redirect
//   └─ responseType
//