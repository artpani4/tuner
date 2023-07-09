import { loadConfig } from './draft1.ts';
const config = await loadConfig();

config = {
  env: {
    PORT: 1488,
    HOST: '127.0.0.1',
    DEBUG: false,
    JWT: '',
    BOT_API_KEY: 'key',
  },
  config: {
    featureA: {
      q: 100,
    },

    featureB: {
      enable: false,
      x: 0,
      y: '',
      z: [],
    },
    featureC: {
      r: 100,
      t: 'ololo',
      y: false,
    },

    logfareHost: 'https://',
    loggingLevel: 'trace',
    someUrl: 'htttttttp:....',
  },
};
