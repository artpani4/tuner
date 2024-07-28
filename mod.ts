import Env from './src/utils/envFuns.ts';
import tune from './src/tuner.ts';

import { loadConfig } from './src/tuner.ts';
import { Load } from './src/loaders.ts';

export default {
  tune,
  Env,
  // getEnv,
  Load,
  use: {
    loadConfig,
  },
};
