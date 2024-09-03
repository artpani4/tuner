import { DevCFGType } from './dev.tuner.ts';
import Tuner from '../../mod.ts';

export const config = await Tuner.use.loadConfig<DevCFGType>({
  configDirPath: 'example2/config_ololo',
});

console.log(config);
