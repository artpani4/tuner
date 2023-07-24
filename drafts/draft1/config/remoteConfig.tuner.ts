import { ITunerConfig } from '../typeFunc.ts';
import Env from '../envFun.ts';

export default {
  env: {
    PORT: Env.getNumber.orDefault(-100),
  },
  config: {
    featureCommon: {
      x: 200,
      y: 'remotevalue',
      z: [],
    },
    featureC: {
      r: 100,
      t: 'ololo',
      y: false,
    },
    loggingLevel: 'Clevel',
  },
} as ITunerConfig;
