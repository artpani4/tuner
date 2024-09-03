import luminous from '@vseplet/luminous';
import { ITunerConfig } from './type.ts';
import { resolve } from '@std/path';
import { findDirectoryInCWD } from './utils/pathHelper.ts';

const loggerOptions = new luminous.OptionsBuilder().setName('LOADERS')
  .build();
const log = new luminous.Logger(loggerOptions);

/**
 * Получает конфигурацию из указанного абсолютного пути.
 * @param path Путь к файлу с конфигурацией.
 * @returns {() => Promise<ITunerConfig>} Возвращает функцию, которая возвращает объект с конфигурацией.
 */
const absolutePath = <T extends ITunerConfig>(
  path: string,
): { fun: () => Promise<T>; args: string; type: string } => ({
  fun: async (): Promise<T> => {
    try {
      const currentDir = Deno.cwd();

      const dirEntries = [];
      for await (const entry of Deno.readDir(currentDir)) {
        dirEntries.push(entry.name);
      }

      const module = await import(path);

      return module.default as T;
    } catch (error) {
      log.err(
        `Error loading config from absolute path: ${path} - ${error}`,
      );
      throw error;
    }
  },
  args: path,
  type: 'absolutePath',
});

/**
 * Получает конфигурацию из файла в директории "config" в текущей рабочей директории.
 * @param path Относительный путь к файлу с конфигурацией.
 * @returns {Promise<() => Promise<ITunerConfig>>} Возвращает функцию, которая возвращает объект с конфигурацией.
 * @throws Error если директория "config" не найдена.
 */
const configDir = <T extends ITunerConfig>(
  path: string,
  configDirPath: string = './config', // Указание пути к директории
): { fun: () => Promise<T>; args: string; type: string } => ({
  fun: async (): Promise<T> => {
    try {
      const modulePath = 'file://' + resolve(configDirPath, path);
      const module = await import(modulePath);

      return module.default as T;
    } catch (error) {
      log.err(
        `Error loading config from config directory: ${path} - ${error}`,
      );
      throw error;
    }
  },
  args: path,
  type: 'configDir',
});

/**
 * Получает конфигурацию из файла в текущей рабочей директории.
 * @param path Относительный путь к файлу с конфигурацией в текущей рабочей директории.
 * @returns {Promise<() => Promise<ITunerConfig>>} Возвращает функцию, которая возвращает объект с конфигурацией.
 */
const cwd = <T extends ITunerConfig>(
  path: string,
): { fun: () => Promise<T>; args: string } => ({
  fun: async (): Promise<T> => {
    try {
      const modulePath = 'file:///' + resolve('./', path);
      const module = await import(modulePath);

      return module.default as T;
    } catch (error) {
      log.err(`Error loading config from CWD: ${path} - ${error}`);
      throw error;
    }
  },
  args: path,
});

/**
 * Импортирует код из строки с типом TypeScript.
 * @param code Код в формате текста с типом TypeScript.
 * @returns {Promise<any>} Возвращает модуль, полученный из строки кода.
 */
export const importFromString = async (
  code: string,
): Promise<any> => {
  try {
    const base64Code = `data:application/typescript;base64,${
      btoa(code)
    }`;
    const module = await import(base64Code);

    return module;
  } catch (error) {
    log.err(`Error importing module from string: ${error}`);
    throw error;
  }
};

/**
 * Загружает конфигурацию из строки с типом TypeScript, полученной с помощью функции обратного вызова.
 * @param cb Функция обратного вызова, которая возвращает промис с текстом кода конфигурации в формате TypeScript.
 * @returns {Promise<ITunerConfig>} Возвращает промис с объектом конфигурации.
 */
const remoteAsString = <T extends ITunerConfig>(
  cb: () => Promise<string>,
): { fun: () => Promise<T>; args: any } => ({
  fun: async (): Promise<T> => {
    try {
      const code = await cb();
      const module = await importFromString(code);

      return module as T;
    } catch (error) {
      log.err(`Error loading remote config as string: ${error}`);
      throw error;
    }
  },
  args: cb.arguments,
});

/**
 * Загружает конфигурацию из модуля с типом TypeScript, полученного с помощью функции обратного вызова.
 * @param cb Функция обратного вызова, которая возвращает промис с объектом конфигурации в формате { default: ITunerConfig }.
 * @returns {Promise<ITunerConfig>} Возвращает промис с объектом конфигурации.
 */
const remoteAsModule = <T extends ITunerConfig>(
  cb: () => Promise<{ default: ITunerConfig }>,
): { fun: () => Promise<T>; args: any } => ({
  fun: async (): Promise<T> => {
    try {
      const module = await cb();

      return module.default as T;
    } catch (error) {
      log.err(`Error loading remote config as module: ${error}`);
      throw error;
    }
  },
  args: cb.arguments,
});

/**
 * Загружает конфигурацию из файла с указанным источником.
 * @param source Путь к файлу с конфигурацией.
 * @returns {Promise<ITunerConfig>} Возвращает промис с объектом конфигурации.
 */
const remoteByImport = <T extends ITunerConfig>(
  source: string,
): { fun: () => Promise<T>; args: string } => ({
  fun: async (): Promise<T> => {
    try {
      const module = await import(source);

      return module.default as T;
    } catch (error) {
      log.err(
        `Error loading remote config by import: ${source} - ${error}`,
      );
      throw error;
    }
  },
  args: source,
});

/**
 * Загрузчик конфигурации, предоставляющий функции для получения конфигурации из различных источников.
 */
export const Load = {
  local: {
    absolutePath,
    configDir,
    cwd,
  },
  // remote: {
  //   import: remoteByImport,
  //   callbackReturnModule: remoteAsModule,
  //   callbackReturnString: remoteAsString,
  //   providers: {},
  // },
};
