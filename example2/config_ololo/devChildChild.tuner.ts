import Tuner from '../../mod.ts';

const devChildChildCfg = Tuner.tune({
  data: {
    chrono2: {
      DELAY_ORDER_RESEND_TO_QUEUE_MINUTES: 1,
    },
  },
});

export default devChildChildCfg;
export type DevChildChildCFGType = typeof devChildChildCfg;
