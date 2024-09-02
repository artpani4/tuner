import Tuner from '../../mod.ts';

const baseCfg = Tuner.tune({
  env: {
    //TODO сделать дефолтную ошибку отсуствия env-переменной в тюнере
    CONFIG: Tuner.Env.getString.orExit(),
    // XATA_API_KEY: Tuner.Env.getString.orThrow(
    //   new Error('No XATA API KEY!'),
    // ),
    // XATA_HTTP_ENDPOINT: Tuner.Env.getString.orThrow(
    //   new Error('No XATA_HTTP_ENDPOINT!'),
    // ),
    // XATA_BRANCH: Tuner.Env.getString.orThrow(
    //   new Error('No XATA BRANCH!'),
    // ),
    // TG_BOT_TOKEN: Tuner.Env.getString.orThrow(
    //   new Error('No TG_BOT_TOKEN!'),
    // ),
    // WEBAPP_URL: Tuner.Env.getString.orThrow(
    //   new Error('No WEBAPP_URL!'),
    // ),
    DOPPLER_CONFIG: Tuner.Env.getString.orDefault('prd'),
    // WEBHOOK_URL: Tuner.Env.getString.orDefault(''),
    VITE_API_URL: Tuner.Env.getString.orNothing(),
  },
});

export default baseCfg;
export type BaseCFGType = typeof baseCfg;
