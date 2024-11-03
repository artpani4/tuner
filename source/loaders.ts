// source/loaders.ts

import luminous from '@vseplet/luminous';
import { ITunerConfig } from './type.ts';
import { resolve } from '@std/path';
import { findDirectoryInCWD } from './utils/pathHelper.ts';

const loggerOptions = new luminous.OptionsBuilder().setName('LOADERS').build();
const log = new luminous.Logger(loggerOptions);

/**
 * Получает конфигурацию из указанного абсолютного пути.
 * @param path Путь к файлу с конфигурацией.
 * @param useAbsolutePath Использовать ли префикс file:///.
 * @returns Объект с функцией загрузки конфигурации.
 */
const absolutePath = <T extends ITunerConfig>(
  path: string,
  useAbsolutePath: boolean = true,
): { fun: () => Promise<T>; args: string; type: string } => ({
  fun: async (): Promise<T> => {
    try {
      console.log(path)
      const fullPath = useAbsolutePath ? `file:///${path}` : path;
      const module = await import(fullPath);

      return module.default as T;
    } catch (error) {
      log.err(`Error loading config from absolute path: ${path} - ${error}`);
      throw error;
    }
  },
  args: path,
  type: 'absolutePath',
});

/**
 * Получает конфигурацию из файла в директории config в текущей рабочей директории.
 * @param path Относительный путь к файлу с конфигурацией.
 * @param configDirPath Путь к директории конфигурации.
 * @param useAbsolutePath Использовать ли префикс file:///.
 * @returns Объект с функцией загрузки конфигурации.
 */
const configDir = <T extends ITunerConfig>(
  path: string,
  configDirPath: string = './config',
  useAbsolutePath: boolean = true,
): { fun: () => Promise<T>; args: string; type: string } => ({
  fun: async (): Promise<T> => {
    try {
      const modulePath = (useAbsolutePath ? 'file:///' : '') + resolve(configDirPath, path);
      const module = await import(modulePath);

      return module.default as T;
    } catch (error) {
      log.err(`Error loading config from config directory: ${path} - ${error}`);
      throw error;
    }
  },
  args: path,
  type: 'configDir',
});

/**
 * Получает конфигурацию из файла в текущей рабочей директории.
 * @param path Относительный путь к файлу с конфигурацией в текущей рабочей директории.
 * @param useAbsolutePath Использовать ли префикс file:///.
 * @returns Объект с функцией загрузки конфигурации.
 */
const cwd = <T extends ITunerConfig>(
  path: string,
  useAbsolutePath: boolean = true,
): { fun: () => Promise<T>; args: string } => ({
  fun: async (): Promise<T> => {
    try {
      const modulePath = (useAbsolutePath ? 'file:///' : '') + resolve('./', path);
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
