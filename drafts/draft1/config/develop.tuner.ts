import { ITunerConfig } from '../typeFunc.ts';
import Env from '../envFun.ts';
export default {
  parent: './developParent.tuner.ts',
  // Тут любой колбэк, который возвращает string или конфиг
  child: () => import('./remoteConfig.tuner.ts'),
  env: {
    PORT: Env.getNumber.orDefault(1),
    HOST: Env.getString.orDefault('develop'),
    DEBUG: Env.getBoolean.orDefault(false),
    BOT_API_KEY: Env.getString.orExit(),
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
    someUrl: 'develop',
    logfareHost: 'https://',
    loggingLevel: 'trace',
  },
} as ITunerConfig;
