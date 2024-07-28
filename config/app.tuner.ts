import Tuner from '../mod.ts';
import { BotCfgType } from './bot.tuner.ts';

const cfg = Tuner.tune({
  child: Tuner.Load.local.cwd<BotCfgType>('config/bot.tuner.ts'),
  env: {
    SOME_ENV: Tuner.Env.getNumber.orCompute(() => Math.random()),
  },
  data: {
    timers: {
      cronPattern: '/1/1/1/1/1',
    },
    appName: 'TelegramBotApp',
    logLevel: 'info',
    someCommonField: 'ТЫ НЕ ДОЛЖЕН УВЕДИТЬ ЭТУ СТРОКУ',
  },
});

export default cfg;
export type AppCfgType = typeof cfg;
