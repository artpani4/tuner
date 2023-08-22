import tune from './src/tunerFun.ts';
import Env from './src/envFuns.ts';
import { getEnv, onChangeTrigger } from './src/tuner.ts';
import Load from './src/loaders.ts';
import { loadConfig } from './src/tuner.ts';
import { generateSchema } from './src/scheme.ts';
import { IFilledTunerConfig } from './src/type.ts';

export default {
  tune,
  Env,
  getEnv,
  Load,
  use: {
    loadConfig,
    generateSchema,
  },
  onChanged: onChangeTrigger<IFilledTunerConfig>,
};
