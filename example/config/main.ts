import Tuner from '../../mod.ts';
import { DevelopCfgType } from './develop.tuner.ts';

const c = await Tuner.use.loadConfig<DevelopCfgType>({
  configDirPath: 'example',
});
console.log(c.data);
