import tune from './src/tunerFun.ts';
import Env from './src/envFun.ts';
import { getEnv } from './src/tuner.ts';
import Load from './src/loadFun.ts';
import { loadConfig } from './src/tuner.ts';
import { generateSchema } from './schema/generator.ts';

export default {
  tune,
  Env,
  getEnv,
  Load,
  use: {
    loadConfig,
    generateSchema,
  },
};
