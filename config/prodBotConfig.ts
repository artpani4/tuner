import {BotConfig} from './botConfigSchema.ts';
const prodBotConfig: BotConfig = {
  name: 'prod',
  secrets: [
    {
      name: 'API_KEY',
      value: 'ololo1',
    },
  ],
  telegram: {
    botToken: 'ololo',
    name: 'artpani',
    tokens: [{
      a: 10,
      b: 20,
      c: 30,
    }, {
      a: 40,
      b: 100,
      d: 500,
      f: 900,
    }],
  },
  database: {
    supaApi: 'lalala',
    username: 'ololoev',
    password: 'mmm',
  },
};

export default prodBotConfig;
