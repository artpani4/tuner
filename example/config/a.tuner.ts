import Tuner from '../../mod.ts';

export default Tuner.tune({
  //   child: Tuner.Load.remote.import(
  //     'http://localhost:8000/example/config/b.tuner.ts',
  //   ),
  env: {
    someField: Tuner.Env.getString.orDefault('effe'),
  },
  // child: Tuner.Load.remote.providers.notion(
  //   Tuner.getEnv('NOTION_KEY'),
  //   'https://www.notion.so/artpani/d1ecc246b8304e08a780b9a312548064?pvs=4#ef81f9e0a6b9482db00b2045bc1a76c4',
  // ),
  config: {
    b: 209,
    e: 20,
    f: 780,
    CONFIG_A: false,
  },
});
