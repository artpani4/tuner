import {
  jsonOrExit,
  orBool,
  orNumber,
  orString,
  stringOrExit,
} from './typeFunc.ts';

export default {
  parent: './baseConfig.ts',
  child: () => import('./remoteConfig.ts'),
  env: {
    PORT: orNumber(1488),
    HOST: orString('127.0.0.1'),
    DEBUG: orBool(false),
    JWT: jsonOrExit(),
    BOT_API_KEY: stringOrExit(),
  },

  config: {
    featureA: {
      enable: true,
      x: 0,
      y: '',
      z: [],
    },

    featureB: {
      enable: false,
      x: 0,
      y: '',
      z: [],
    },

    logfareHost: 'https://',
    loggingLevel: 'trace',
  },
};
