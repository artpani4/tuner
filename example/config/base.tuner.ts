import Tuner from '../../mod.ts';
export default Tuner.tune({
  env: {
    PORT: Tuner.Env.getNumber.orDefault(10),
    HOST: Tuner.Env.getString.orDefault('localhost'),
    SOME_KEY: Tuner.Env.getString.orDefault('some_key'),
  },
  config: {
    featureCommon: {
      valueBase: true,
      x: 3,
    },

    featureB: {
      valueBase: 10,
    },

    someUrl: 'htttttttp:....',
  },
});
