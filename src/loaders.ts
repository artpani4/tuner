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
  return async () => {
    return (await import(path)).default as ITunerConfig;
  };
};

/**
 * Получает конфигурацию из файла в директории "config" в текущей рабочей директории.
 * @param path Относительный путь к файлу с конфигурацией в директории "config".
 * @returns {Promise<() => Promise<ITunerConfig>>} Возвращает функцию, которая возвращает объект с конфигурацией.
 * @throws Error если директория "config" не найдена.
 */
const fromConfigDir = (path: string) => {
  return async () => {
    const configDir = await findDirectoryInCWD('config');
    if (configDir === null) {
      throw new Error('config directory not found');
    }
    const module = await import(`${resolve(configDir, path)}`);
    // console.log(module);
    return module
      .default as ITunerConfig;
  };
};

/**
 * Получает конфигурацию из файла в текущей рабочей директории.
 * @param path Относительный путь к файлу с конфигурацией в текущей рабочей директории.
 * @returns {Promise<() => Promise<ITunerConfig>>} Возвращает функцию, которая возвращает объект с конфигурацией.
 */
const fromCWD = (path: string) => async () => {
  return (await import(resolve(Deno.cwd(), path)))
    .default as ITunerConfig;
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

const remoteAsString = (cb: () => Promise<string>) => async () => {
  return await importFromString(await cb()) as ITunerConfig;
};

const remoteAsModule =
  (cb: () => Promise<{ default: ITunerConfig }>) => async () => {
    return (await cb()).default as ITunerConfig;
  };

const remoteByImport = (source: string) => async () => {
  const module = await import(source);
  return module.default as ITunerConfig;
};
// (await import(source)).default as ITunerConfig;

/**
 * Функция-фабрика для получения конфигурации из Notion с использованием предоставленного ключа и идентификатора блока.
 * @param key Ключ аутентификации для доступа к API Notion.
 * @param blockUrl URL блока Notion, содержащего конфигурацию.
 * @returns {() => Promise<ITunerConfig>} Возвращает функцию, которая возвращает объект с конфигурацией из Notion.
 */
const notionLoad = (key: string, blockUrl: string) => () =>
  getNotionConfig(key, blockUrl);

/**
 * Функция-фабрика для получения конфигурации из репозитория GitHub с использованием предоставленного API-ключа, владельца репозитория, названия репозитория и пути к файлу.
 * @param apiKey API-ключ для аутентификации при доступе к репозиторию GitHub.
 * @param owner Владелец репозитория GitHub.
 * @param repo Название репозитория GitHub.
 * @param path Путь к файлу в репозитории GitHub.
 * @returns {() => Promise<ITunerConfig>} Возвращает функцию, которая возвращает объект с конфигурацией из репозитория GitHub.
 */
const GithubLoad =
  (key: string, owner: string, repo: string, path: string) => () =>
    getGitHubConfig(key, owner, repo, path);

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
