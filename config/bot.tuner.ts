import Tuner from '../mod.ts';

const cfg = Tuner.tune({
  data: {
    adminId: 123456789,
    botName: 'MyBot',
    someCommonField: 'ЭТО ПОЛЕ ОТ БОТА - дочернего конфига',
  },
  env: {
    TOKEN: Tuner.Env.getString.orDefault('OLOLO'),
  },
});

export default cfg;
export type BotCfgType = typeof cfg;
