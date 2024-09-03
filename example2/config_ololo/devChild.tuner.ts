import Tuner from '../../mod.ts';
import { DevChildChildCFGType } from './devChildChild.tuner.ts';

const devChildCfg = Tuner.tune({
  child: Tuner.Load.local.configDir<DevChildChildCFGType>(
    'devChildChild.tuner.ts',
  ),
  data: {
    chrono3: {
      ololo: {
        trololo: 2,
      },
      DELAY_ORDER_RESEND_TO_QUEUE_MINUTES: 1,
    },
  },
});

export default devChildCfg;
export type DevChildCFGType = typeof devChildCfg;
