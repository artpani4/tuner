import Tuner from '../../mod.ts';
const cfg = Tuner.tune({
  data: {
    a: 100,
    d: 101,
    timers: {
      x: 100,
    },
  },
  env: {
    alala: 'oenfoewn',
  },
});

export default cfg;
export type BcfgType = typeof cfg;
