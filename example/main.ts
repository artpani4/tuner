// import Tuner from '../mod.ts';
// import { Config } from './config/schema.ts';
// const config = (await Tuner.use.loadConfig()) as Config;

// config/develop.tuner.ts
import Tuner from '../mod.ts';
export default Tuner.tune({
  child: Tuner.Load.local.configDir('a.tuner.ts'),
  config: {
    a: 300,
    b: 301,
  },
});
