import { ITunerConfig } from './type.ts';
import { resolve } from '@libs/std/';
import { findDirectoryInCWD } from './pathHelper.ts';

/**
 * Получает конфигурацию из указанного абсолютного пути.
 * @param path Путь к файлу с конфигурацией.
 * @returns {Promise<() => Promise<ITunerConfig>>} Возвращает функцию, которая возвращает объект с конфигурацией.
 */
const fromAbsolutePath = (path: string) => {
  return {
    fun: async () => {
      const versionedPath = `${path}?version=${Math.random()}`;
      const module = await import(versionedPath);
      return module.default as ITunerConfig;
    },
    args: path,
  };
};

/**
 * Получает конфигурацию из файла в директории "config" в текущей рабочей директории.
 * @param path Относительный путь к файлу с конфигурацией в директории "config".
 * @returns {Promise<() => Promise<ITunerConfig>>} Возвращает функцию, которая возвращает объект с конфигурацией.
 * @throws Error если директория "config" не найдена.
 */
const fromConfigDir = (path: string) => {
  return {
    fun: async () => {
      const configDir = await findDirectoryInCWD('config');

      if (configDir === null) {
        throw new Error('config directory not found');
      }

      const modulePath = resolve(configDir, path) +
        `?version=${Math.random()}`;
      const module = (await import(`file://${modulePath}`)) as {
        default: ITunerConfig;
      };
      return module.default;
    },
    args: path,
  };
};

/**
 * Получает конфигурацию из файла в текущей рабочей директории.
 * @param path Относительный путь к файлу с конфигурацией в текущей рабочей директории.
 * @returns {Promise<() => Promise<ITunerConfig>>} Возвращает функцию, которая возвращает объект с конфигурацией.
 */
const fromCWD = (path: string) => {
  return {
    fun: async () => {
      const modulePath = resolve('./', path) +
        `?version=${Math.random()}`;
      const module = await import(modulePath);
      return module.default as ITunerConfig;
    },
    args: path,
  };
};

/**
 * Импортирует код из строки с типом TypeScript.
 * @param code Код в формате текста с типом TypeScript.
 * @returns {Promise<any>} Возвращает модуль, полученный из строки кода.
 */
export async function importFromString(code: string) {
  const base64Code = `data:application/typescript;base64,${
    btoa(code)
  }`;
  const module = await import(base64Code);
  return module;
}

/**
 * Загружает конфигурацию из строки с типом TypeScript, полученной с помощью функции обратного вызова.
 * @param cb Функция обратного вызова, которая возвращает промис с текстом кода конфигурации в формате TypeScript.
 * @returns {Promise<ITunerConfig>} Возвращает промис с объектом конфигурации.
 */
const remoteAsString = (cb: () => Promise<string>) => {
  return {
    fun: async () => {
      const code = await cb();
      const module = await importFromString(code);
      return module as ITunerConfig;
    },
    args: cb.arguments,
  };
};

/**
 * Загружает конфигурацию из модуля с типом TypeScript, полученного с помощью функции обратного вызова.
 * @param cb Функция обратного вызова, которая возвращает промис с объектом конфигурации в формате { default: ITunerConfig }.
 * @returns {Promise<ITunerConfig>} Возвращает промис с объектом конфигурации.
 */
const remoteAsModule = (
  cb: () => Promise<{ default: ITunerConfig }>,
) => {
  return {
    fun: async () => {
      const module = await cb();
      return module.default as ITunerConfig;
    },
    args: cb.arguments,
  };
};

/**
 * Загружает конфигурацию из файла с указанным источником.
 * @param source Путь к файлу с конфигурацией.
 * @returns {Promise<ITunerConfig>} Возвращает промис с объектом конфигурации.
 */
const remoteByImport = (source: string) => {
  return {
    fun: async () => {
      const module = await import(source);
      return module.default as ITunerConfig;
    },
    args: source,
  };
};

/**
 * Загрузчик конфигурации, предоставляющий функции для получения конфигурации из различных источников.
 */
const Load = {
  local: {
    absolutePath: fromAbsolutePath,
    configDir: fromConfigDir,
    cwd: fromCWD,
  },
  remote: {
    import: remoteByImport,
    callbackReturnModule: remoteAsModule,
    callbackReturnString: remoteAsString,
    providers: {},
  },
};

export default Load;
