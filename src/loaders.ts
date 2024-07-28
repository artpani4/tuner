import luminous from '@vseplet/luminous';
import { ITunerConfig } from './type.ts';
import { resolve } from 'https://deno.land/std/path/mod.ts';
import {
  findDirectory,
  findDirectoryInCWD,
} from './utils/pathHelper.ts';

const loggerOptions = new luminous.OptionsBuilder().setName('LOADERS')
  .build();
const log = new luminous.Logger(loggerOptions);

/**
 * Получает конфигурацию из указанного абсолютного пути.
 * @param path Путь к файлу с конфигурацией.
 * @returns {Promise<() => Promise<ITunerConfig>>} Возвращает функцию, которая возвращает объект с конфигурацией.
 */
function absolutePath<T extends ITunerConfig>(path: string) {
  return {
    fun: async (): Promise<T> => {
      try {
        const versionedPath = `${path}?version=${Math.random()}`;
        const module = await import(versionedPath);
        log
          .inf(
            `Successfully loaded config from absolute path: ${path}`,
          );
        return module.default as T;
      } catch (error) {
        log
          .err(
            `Error loading config from absolute path: ${path} - ${error}`,
          );
        throw error;
      }
    },
    args: path,
  };
}

/**
 * Получает конфигурацию из файла в директории "config" в текущей рабочей директории.
 * @param path Относительный путь к файлу с конфигурацией.
 * @returns {Promise<() => Promise<ITunerConfig>>} Возвращает функцию, которая возвращает объект с конфигурацией.
 * @throws Error если директория "config" не найдена.
 */
function configDir<T extends ITunerConfig>(path: string) {
  return {
    fun: async (): Promise<T> => {
      try {
        const modulePath = resolve(path) +
          `?version=${Math.random()}`;
        const module = await import(`${modulePath}`);
        log.inf(
          `Successfully loaded config from config directory: ${modulePath}`,
        );
        return module.default as T;
      } catch (error) {
        log.err(
          `Error loading config from config directory: ${path} - ${error}`,
        );
        throw error;
      }
    },
    args: path,
  };
}
/**
 * Получает конфигурацию из файла в текущей рабочей директории.
 * @param path Относительный путь к файлу с конфигурацией в текущей рабочей директории.
 * @returns {Promise<() => Promise<ITunerConfig>>} Возвращает функцию, которая возвращает объект с конфигурацией.
 */
function cwd<T extends ITunerConfig>(path: string) {
  return {
    fun: async (): Promise<T> => {
      try {
        const modulePath = resolve('./', path) +
          `?version=${Math.random()}`;
        const module = await import(modulePath);
        log.inf(`Successfully loaded config from CWD: ${path}`);
        return module.default as T;
      } catch (error) {
        log.err(`Error loading config from CWD: ${path} - ${error}`);
        throw error;
      }
    },
    args: path,
  };
}

/**
 * Импортирует код из строки с типом TypeScript.
 * @param code Код в формате текста с типом TypeScript.
 * @returns {Promise<any>} Возвращает модуль, полученный из строки кода.
 */
export async function importFromString(code: string) {
  try {
    const base64Code = `data:application/typescript;base64,${
      btoa(code)
    }`;
    const module = await import(base64Code);
    log.inf`Successfully imported module from string`;
    return module;
  } catch (error) {
    log.err(`Error importing module from string: ${error}`);
    throw error;
  }
}

/**
 * Загружает конфигурацию из строки с типом TypeScript, полученной с помощью функции обратного вызова.
 * @param cb Функция обратного вызова, которая возвращает промис с текстом кода конфигурации в формате TypeScript.
 * @returns {Promise<ITunerConfig>} Возвращает промис с объектом конфигурации.
 */
function remoteAsString<T extends ITunerConfig>(
  cb: () => Promise<string>,
) {
  return {
    fun: async (): Promise<T> => {
      try {
        const code = await cb();
        const module = await importFromString(code);
        log.inf`Successfully loaded remote config as string`;
        return module as T;
      } catch (error) {
        log.err(`Error loading remote config as string: ${error}`);
        throw error;
      }
    },
    args: cb.arguments,
  };
}

/**
 * Загружает конфигурацию из модуля с типом TypeScript, полученного с помощью функции обратного вызова.
 * @param cb Функция обратного вызова, которая возвращает промис с объектом конфигурации в формате { default: ITunerConfig }.
 * @returns {Promise<ITunerConfig>} Возвращает промис с объектом конфигурации.
 */
function remoteAsModule<T extends ITunerConfig>(
  cb: () => Promise<{ default: ITunerConfig }>,
) {
  return {
    fun: async (): Promise<T> => {
      try {
        const module = await cb();
        log.inf`Successfully loaded remote config as module`;
        return module.default as T;
      } catch (error) {
        log.err(`Error loading remote config as module: ${error}`);
        throw error;
      }
    },
    args: cb.arguments,
  };
}

/**
 * Загружает конфигурацию из файла с указанным источником.
 * @param source Путь к файлу с конфигурацией.
 * @returns {Promise<ITunerConfig>} Возвращает промис с объектом конфигурации.
 */
function remoteByImport<T extends ITunerConfig>(source: string) {
  return {
    fun: async (): Promise<T> => {
      try {
        const module = await import(source);
        log
          .inf`Successfully loaded remote config by import: ${source}`;
        return module.default as T;
      } catch (error) {
        log
          .err(
            `Error loading remote config by import: ${source} - ${error}`,
          );
        throw error;
      }
    },
    args: source,
  };
}

/**
 * Загрузчик конфигурации, предоставляющий функции для получения конфигурации из различных источников.
 */
export const Load = {
  local: {
    absolutePath,
    configDir,
    cwd,
  },
  remote: {
    import: remoteByImport,
    callbackReturnModule: remoteAsModule,
    callbackReturnString: remoteAsString,
    providers: {},
  },
};
