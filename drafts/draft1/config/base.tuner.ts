import Env from '../envFun.ts';
export default {
  env: {
    PORT: Env.getNumber.orDefault(10),
    HOST: Env.getString.orDefault('localhost'),
    SOME_KEY: Env.getString.orDefault('some_key'),
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
};
