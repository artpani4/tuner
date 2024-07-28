import Tuner from '../mod.ts';
import { Config } from './config/configSchema.ts';

const config = (await Tuner.use.loadConfig()) as Config;

setInterval(() => console.log(Deno.memoryUsage()), 500);
