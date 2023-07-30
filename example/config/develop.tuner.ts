import Tuner from '../../mod.ts';

export default Tuner.tune({
  parent: Tuner.Load.local.configDir('./developParent.tuner.ts'),
  child: Tuner.Load.remote.github(
    Tuner.getEnv('GITHUB_KEY'),
    'artpani4',
    'configTest',
    'configTest.ts',
  ),

  // child: Tuner.Load.remote.notion(
  //   Tuner.getEnv('NOTION_KEY'),
  //   '6413ffbc96494918aa32ae1f138b87d9',
  // ),
  // child: Load.local.configDir('remoteConfig.tuner.ts'),
  env: {
    PORT: Tuner.Env.getNumber.orDefault(1),
    HOST: Tuner.Env.getString.orDefault('develop'),
    DEBUG: Tuner.Env.getBoolean.orDefault(false),
    BOT_API_KEY: Tuner.Env.getString.orExit(),
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
});

