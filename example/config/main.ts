import Tuner from '../../mod.ts';
import { Config } from './configSchema.ts';
let cfg = (await Tuner.use.loadConfig()) as Config;
// Tuner.use.generateSchema(
//   cfg,
//   'config',
//   'example/config/configSchema.ts',
// );
await Tuner.onChanged(async (_data) => {
  cfg = (await Tuner.use.loadConfig()) as Config;
  console.log(cfg);
});

setInterval(() => {}, 2000);

// const a = async (x: number) => x + 2;
// const b = async (x: number) => x + 2;

// console.log(a.toString() === b.toString());
