// config/develop.tuner.ts
import Tuner from '../../mod.ts';
export default Tuner.tune({
  child: Tuner.Load.local.configDir('a.tuner.ts'),
  parent: Tuner.Load.local.configDir('base.tuner.ts'),
  config: {
    a: 300,
    b: 301,
  },
});
