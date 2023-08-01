import Tuner from '../../mod.ts';
import { Config } from './configSchema.ts';
const cfg = (await Tuner.use.loadConfig()) as Config;
// Tuner.use.generateSchema(
//   cfg,
//   'config',
//   'example/config/configSchema.ts',
// );
console.log(cfg);
