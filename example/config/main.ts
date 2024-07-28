import Tuner from '../../mod.ts';
import { Ward } from '../../src/ward/ward.ts';

let cfg = await Tuner.use.loadConfig();
// await Tuner.use.generateSchema(
//   cfg,
//   'config',
//   'example/config/configSchema.ts',
// );
await Tuner.onChanged(async (_data) => {
  //   cfg = (await Tuner.use.loadConfig()) as Config;
  cfg = await Tuner.use.loadConfig();
  console.log(cfg);
});

setInterval(() => {
  // console.log(Ward.wards.map((ward) => ward.period).join(' '));
  console.log(Deno.memoryUsage().heapUsed);
  //   gc();
}, 600);

// const a = async (x: number) => x + 2;
// const b = async (x: number) => x + 2;

// console.log(a.toString() === b.toString());
