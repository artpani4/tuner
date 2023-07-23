import { loadConfig } from './tuner.ts';
const config = await loadConfig();

// config = {
//   env: {
//     PORT: 1488,
//     HOST: '127.0.0.1',
//     DEBUG: false,
//     JWT: '',
//     BOT_API_KEY: 'key',
//   },
//   config: {
//     featureA: {
//       enable: true,
//       x: 200,
//       y: 'remotevalue',
//       z: [],
//       valueA: true,
//     },

//     featureB: {
//       enable: false,
//       x: 0,
//       y: '',
//       z: [],
//       valueB: 10,
//     },
//     featureC: {
//       r: 100,
//       t: 'ololo',
//       y: false,
//     },

//     logfareHost: 'https://',
//     loggingLevel: 'Clevel',
//     someUrl: 'htttttttp:....',
//   },
// };
