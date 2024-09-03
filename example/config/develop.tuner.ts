import Tuner from '../../mod.ts';
import { AcfgType } from './a.tuner.ts';
import { BcfgType } from './b.tuner.ts';
const cfg = Tuner.tune({
  child: Tuner.Load.local.configDir<AcfgType>('a.tuner.ts'),
  parent: Tuner.Load.local.configDir<BcfgType>(
    'b.tuner.ts',
  ),
  data: {
    test: 1000,
    develop: true,
    b: 900,
    d: 99,
  },
  env: {
    kish: 100,
  },
});

export default cfg;
export type DevelopCfgType = typeof cfg;
