import Tuner from '../mod.ts';
import { AppCfgType } from './app.tuner.ts';

const c = await Tuner.use.loadConfig<AppCfgType>({configName: "app"});
console.log(c);
