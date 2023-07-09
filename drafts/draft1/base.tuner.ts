export default {
  // Пустые значения - значит поля не наследуются
  parent: {
    local: '',
    remote: '',
  },

  env: {
    PORT: orNumber(1488),
    HOST: orString('127.0.0.1'),
  },

  // поле необязательное, зарезервированное
  config: {
    featureA: {
      enable: true,
      x: 0,
      y: '',
      z: [],
    },

    featureB: {
      enable: false,
      x: 0,
      y: '',
      z: [],
    },

    logfareHost: 'https://',
    loggingLevel: 'trace',
  },
};
