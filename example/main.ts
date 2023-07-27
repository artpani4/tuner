import Tuner from '../mod.ts';
import { Config } from './config/schema.ts';
const config = (await Tuner.use.loadConfig()) as Config;
console.log(config);
