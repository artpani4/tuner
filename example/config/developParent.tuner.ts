import Tuner from '../../mod.ts';
export default Tuner.tune({
  parent: Tuner.Load.local.configDir('./base.tuner.ts'),
  env: {
    DEVELOP_PARENT_SOME_KEY: Tuner.Env.getString.orDefault('ololo'),
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
});
