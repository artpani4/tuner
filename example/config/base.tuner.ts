import Tuner from '../../mod.ts';
const cfg = Tuner.tune({
  data: { base: 120 },
  env: {
    base: 'oenfoewn',
  },
});

export default cfg;
export type BaseCfgType = typeof cfg;
