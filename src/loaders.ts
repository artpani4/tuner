import { ITunerConfig } from './type.ts';
import { resolve } from 'https://deno.land/std@0.195.0/path/posix.ts';
import { findDirectoryInCWD } from './pathHelper.ts';
import {
  getGitHubConfig,
  getNotionConfig,
} from './provider/service.ts';

/**
 * Получает конфигурацию из указанного абсолютного пути.
 * @param path Путь к файлу с конфигурацией.
 * @returns {Promise<() => Promise<ITunerConfig>>} Возвращает функцию, которая возвращает объект с конфигурацией.
 */

const fromAbsolutePath = (path: string) => {
  return {
    fun: async () => {
      return (await import(path + `?version=${Math.random()}`))
        .default as ITunerConfig;
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

      const module = await import(
        `file:///${resolve(configDir, path)}?version=${Math.random()}`
      );
      return module
        .default as ITunerConfig;
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
    fun: async () =>
      (await import(
        resolve('./', path + `?version=${Math.random()}`)
      ))
        .default as ITunerConfig,
    args: path,
  };
};

/**
 * Импортирует код из строки с типом TypeScript.
 * @param code Код в формате текста с типом TypeScript.
 * @returns {Promise<any>} Возвращает модуль, полученный из строки кода.
 */
export async function importFromString(code: string) {
  const module = await import(
    `data:application/typescript;base64,${btoa(code)}`
  );
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
      return await importFromString(await cb()) as ITunerConfig;
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
      return (await cb()).default as ITunerConfig;
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
 * Функция-фабрика для получения конфигурации из Notion с использованием предоставленного ключа и идентификатора блока.
 * @param key Ключ аутентификации для доступа к API Notion.
 * @param blockUrl URL блока Notion, содержащего конфигурацию.
 * @returns {() => Promise<ITunerConfig>} Возвращает функцию, которая возвращает объект с конфигурацией из Notion.
 */
const notionLoad = (key: string, blockUrl: string) => {
  return {
    fun: () => getNotionConfig(key, blockUrl),
    args: [key, blockUrl],
  };
};

/**
 * Функция-фабрика для получения конфигурации из репозитория GitHub с использованием предоставленного API-ключа, владельца репозитория, названия репозитория и пути к файлу.
 * @param apiKey API-ключ для аутентификации при доступе к репозиторию GitHub.
 * @param owner Владелец репозитория GitHub.
 * @param repo Название репозитория GitHub.
 * @param path Путь к файлу в репозитории GitHub.
 * @returns {() => Promise<ITunerConfig>} Возвращает функцию, которая возвращает объект с конфигурацией из репозитория GitHub.
 */
const GithubLoad = (
  key: string,
  owner: string,
  repo: string,
  path: string,
) => {
  return {
    fun: () => getGitHubConfig(key, owner, repo, path),
    args: [key, owner, repo, path],
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
    providers: { notion: notionLoad, github: GithubLoad },
  },
};

export default Load;
