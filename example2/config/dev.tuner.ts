import Tuner from '../../mod.ts';
import { BaseCFGType } from './base.tuner.ts';
import { DevChildCFGType } from './devChild.tuner.ts';

const devCfg = Tuner.tune({
  parent: Tuner.Load.local.configDir<BaseCFGType>('base.tuner.ts'),
  child: Tuner.Load.local.configDir<DevChildCFGType>(
    'devChild.tuner.ts',
  ),
  data: {
    chrono: {
      DELAY_ORDER_RESEND_TO_QUEUE_MINUTES: 1,
    },
  },
});

export default devCfg;
export type DevCFGType = typeof devCfg;
