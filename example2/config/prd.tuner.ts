import Tuner from '../../mod.ts';
import { BaseCFGType } from './base.tuner.ts';

const prdCfg = Tuner.tune({
  parent: Tuner.Load.local.configDir<BaseCFGType>('base.tuner.ts'),
  data: {
    chrono: {
      DELAY_ORDER_RESEND_TO_QUEUE_MINUTES: 5,
    },
  },
});

export default prdCfg;
export type PrdCFGType = typeof prdCfg;
