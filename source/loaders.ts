// source/loaders.ts

import { luminous } from './deps.ts';
import { ITunerConfig } from './type.ts';
import { generateRandomString } from './utils/pathHelper.ts';
import { resolvePath } from './utils/pathResolver.ts';

const loggerOptions = new luminous.OptionsBuilder().setName('LOADERS')
  .build();
const log = new luminous.Logger(loggerOptions);

/**
 * Получает конфигурацию из указанного абсолютного пути.
 */
const absolutePath = <T extends ITunerConfig>(
  path: string,
  absolutePathPrefix?: string,
  addSalt: boolean = false,
): { fun: () => Promise<T>; args: string; type: string } => ({
  fun: async (): Promise<T> => {
    try {
      const fullPath = resolvePath(path, absolutePathPrefix, addSalt);
      const module = await import(fullPath);
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

const configDir = <T extends ITunerConfig>(
  path: string,
  configDirPath: string = './config',
  absolutePathPrefix?: string,
  addSalt: boolean = false,
): { fun: () => Promise<T>; args: string; type: string } => ({
  fun: async (): Promise<T> => {
    try {
      const modulePath = resolvePath(
        `${configDirPath}/${path}`,
        absolutePathPrefix,
        addSalt,
      );
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

const cwd = <T extends ITunerConfig>(
  path: string,
  absolutePathPrefix?: string,
  addSalt: boolean = false,
): { fun: () => Promise<T>; args: string } => ({
  fun: async (): Promise<T> => {
    try {
      const modulePath = resolvePath(
        `./${path}`,
        absolutePathPrefix,
        addSalt,
      );
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
