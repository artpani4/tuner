// source/loaders.ts

import luminous from '@vseplet/luminous';
import { ITunerConfig } from './type.ts';
import { resolve } from '@std/path';

const loggerOptions = new luminous.OptionsBuilder().setName('LOADERS').build();
const log = new luminous.Logger(loggerOptions);

/**
 * Получает конфигурацию из указанного абсолютного пути.
 */
const absolutePath = <T extends ITunerConfig>(
  path: string,
  absolutePathPrefix?: string,
): { fun: () => Promise<T>; args: string; type: string } => ({
  fun: async (): Promise<T> => {
    try {
      const fullPath = absolutePathPrefix ? resolve(absolutePathPrefix, path) : path;
      console.log(fullPath)
      const module = await import(`${fullPath}`);
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
 * Получает конфигурацию из файла в директории config.
 */
const configDir = <T extends ITunerConfig>(
  path: string,
  configDirPath: string = './config',
  absolutePathPrefix?: string,
): { fun: () => Promise<T>; args: string; type: string } => ({
  fun: async (): Promise<T> => {
    try {
      const modulePath = absolutePathPrefix
        ? resolve(absolutePathPrefix, configDirPath, path)
        : resolve(configDirPath, path);
      console.log(modulePath)
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
 */
const cwd = <T extends ITunerConfig>(
  path: string,
  absolutePathPrefix?: string,
): { fun: () => Promise<T>; args: string } => ({
  fun: async (): Promise<T> => {
    try {
      const modulePath = absolutePathPrefix ? resolve(absolutePathPrefix, './', path) : resolve('./', path);
      const module = await import(`file://${modulePath}`);
      return module.default as T;
    } catch (error) {
      log.err(`Error loading config from CWD: ${path} - ${error}`);
      throw error;
    }
  },
  args: path,
});

export const Load = {
  local: {
    absolutePath,
    configDir,
    cwd,
  },
};
