import Tuner from '../../mod.ts';

export default Tuner.tune({
  //   child: Tuner.Load.remote.import(
  //     'http://localhost:8000/example/config/b.tuner.ts',
  //   ),
  env: {
    someField: Tuner.Env.getString.orDefault("effe"),
  },
  child: Tuner.Load.remote.providers.notion(
    Tuner.getEnv('NOTION_KEY'),
    'https://www.notion.so/artpani/Tuner-15d96fa233e64e8da65c30bfa2ade5e2?pvs=4#8b52d24ee4e1494392ff3f1b58a73753',
  ),
  config: {
    b: 200,
    e: 201,
  },
});
