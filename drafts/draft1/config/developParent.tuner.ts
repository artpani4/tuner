import { ITunerConfig } from '../typeFunc.ts';
import Env from '../envFun.ts';
export default {
  parent: './base.tuner.ts',
  env: {
    DEVELOP_PARENT_SOME_KEY: Env.getString.orDefault('ololo'),
  },

  config: {
    featureA: {
      developParentFeatureA: 'developParentFeatureA',
    },

    featureB: {
      r: 1000,
    },
    loggingLevel: 'developParent',
    someProp: 'developParent',
  },
} as ITunerConfig;
