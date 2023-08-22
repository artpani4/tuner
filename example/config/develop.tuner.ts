// config/develop.tuner.ts
import Tuner from '../../mod.ts';
export default Tuner.tune({
  child: Tuner.Load.local.cwd('example/config/a.tuner.ts'),
  parent: Tuner.Load.local.cwd('example/config/b.tuner.ts'),
  config: {
    test: 100,
    develop: true,
  },
  watch: 1500,
});
