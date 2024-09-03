import { DevCFGType } from './dev.tuner.ts';
import Tuner from '../../mod.ts';

export const config = await Tuner.use.loadConfig<DevCFGType>({
  configDirPath: 'example2',
  configDirName: 'config_ololo',
});

console.log(config.env.VITE_API_URL);
