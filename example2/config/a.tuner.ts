import { z } from 'https://deno.land/x/zod/mod.ts';
import Tuner from '../../mod.ts';

const cfg = Tuner.tune({
  env: {
    someField: Tuner.Env.getString.orDefault('effe'),
  },
  config: {
    b: 209,
    e: 20,
    f: 780,
    CONFIG_A: false,
  },
});

export default cfg;
export type AcfgType = z.infer<typeof z.object(cfg)>;
