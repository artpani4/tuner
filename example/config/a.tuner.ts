import Tuner from '../../mod.ts';
import { BaseCfgType } from './base.tuner.ts';

const cfg = Tuner.tune({
  child: Tuner.Load.local.cwd<BaseCfgType>(
    'example/config/base.tuner.ts',
  ),
  data: { b: 200, e: 201 },
  env: {
    ololo: 100,
    trololo: Tuner.Env.getBoolean.orDefault(true),
    kish: 800,
  },
});
export default cfg;
export type AcfgType = typeof cfg;
