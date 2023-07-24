import { ITunerConfig } from '../typeFunc.ts';
import Env from '../envFun.ts';
import load from '../loadFun.ts';

export default {
  parent: load.fromConfigDir('./base.tuner.ts'),
  env: {
    DEVELOP_PARENT_SOME_KEY: Env.getString.orDefault('ololo'),
  },

  config: {
    featureCommon: {
      developParentFeatureA: 'developParentFeatureA',
      x: 2,
      y: 'developParent',
      z: ['developParent'],
    },

    featureDevelopParent: {
      r: 1000,
    },
    loggingLevel: 'developParent',
    someProp: 'developParent',
  },
} as ITunerConfig;
