import { ITunerConfig } from '../typeFunc.ts';
import Env from '../envFun.ts';
import Load from '../loadFun.ts';
export default {
  parent: Load.fromConfigDir('./developParent.tuner.ts'),
  // child: Load.fromConfigDir('remoteConfig.tuner.ts'),
  child: Load.remoteAsModule(async () =>
    import('./remoteConfig.tuner.ts')
  ),
  env: {
    PORT: Env.getNumber.orDefault(1),
    HOST: Env.getString.orDefault('develop'),
    DEBUG: Env.getBoolean.orDefault(false),
    BOT_API_KEY: Env.getString.orExit(),
  },

  config: {
    featureCommon: {
      x: 1,
      y: 'develop',
      z: ['develop'],
    },

    featureDevelop: {
      enableDevelop: false,
      xDevelop: 0,
      yDevelop: '',
      zDevelop: [],
    },
    someUrl: 'develop',
    logfareHost: 'https://',
    loggingLevel: 'trace',
  },
} as ITunerConfig;
