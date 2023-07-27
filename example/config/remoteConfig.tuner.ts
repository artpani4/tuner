import Tuner from '../../mod.ts';
export default Tuner.tune({
  env: {
    PORT: Tuner.Env.getNumber.orDefault(-100),
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
});
