import {
  CombinedConfigType,
  DeepExpand,
  IFilledTunerConfig,
  ITunerConfig,
} from './type.ts';
import { MissingConfigNameEnv } from './errors.ts';
import { Load } from './loaders.ts';
import luminous from '@vseplet/luminous';
import { resolve } from 'jsr:@std/path@^1.0.2/resolve';

const loggerOptions = new luminous.OptionsBuilder().setName('TUNER')
  .build();
const log = new luminous.Logger(loggerOptions);

type ConfigList = {
  [key: number]: {
    config: ITunerConfig;
    delivery: () =>
      | ITunerConfig
      | Promise<ITunerConfig>
      | IFilledTunerConfig
      | Promise<IFilledTunerConfig>;
  };
};

interface LoadConfigOptions {
  configDirName?: string;
  configDirPath?: string;
  [key: string]: any;
}

/**
 * Получает значение переменной окружения по указанному имени.
 * Если переменная окружения не задана, то пытается получить значение из файла .env.
 * @param name Имя переменной окружения.
 * @returns Значение переменной окружения.
 * @throws {MissingConfigNameEnv} Если переменная окружения не задана и отсутствует в файле .env.
 */
export function getEnv(name: string): string {
  try {
    const value = Deno.env.get(name);
    if (!value) {
      throw new MissingConfigNameEnv(name);
    }
    return value;
  } catch (error) {
    log.err(`Error getting environment variable ${name}: ${error}`);
    throw error;
  }
}

/**
 * Загружает и объединяет конфигурации из нескольких источников, указанных в порядке наследования.
 * @param options Опции для загрузки конфигурации.
 * @returns Объединенная и заполненная конфигурация.
 */
export async function loadConfig<T>(
  options?: LoadConfigOptions,
): Promise<T> {
  try {
    const configName = getEnv('config');
    const configDir = options?.configDirName || 'config';
    const configDirPath = options?.configDirPath || './';
    const resolvedPath = resolve(
      configDirPath,
      configDir,
      `${configName}.tuner.ts`,
    );

    log.inf(`Resolved config path: ${resolvedPath}`);

    const mainConfig = await Load.local.absolutePath(
      `file:///${resolvedPath}`,
    )
      .fun();
    const configSequence = await inheritList(
      mainConfig,
      {},
      configDir,
      configDirPath,
    );
    const mergedConfig = mergeSequentialConfigs(configSequence);
    return fillEnv(await mergedConfig) as T;
  } catch (error) {
    log.err(`Error loading configuration: ${error}`);
    throw error;
  }
}
/**
 * Заполняет значения переменных окружения в конфигурации, если они являются функциями.
 * @param config Конфигурация с функциями в поле env.
 * @returns Конфигурация с заполненными значениями переменных окружения.
 */
function fillEnv(config: ITunerConfig): IFilledTunerConfig {
  try {
    const filledEnv: { [key: string]: any } = {};

    for (const key in config.env) {
      const value = config.env[key];
      if (typeof value === 'function') {
        filledEnv[key] = value(key);
      } else {
        filledEnv[key] = value;
      }
    }

    return { ...config, env: filledEnv };
  } catch (error) {
    log.err(`Error filling environment variables: ${error}`);
    throw error;
  }
}

/**
 * Рекурсивно объединяет два объекта.
 * @param target Целевой объект, в который происходит объединение.
 * @param source Исходный объект, который объединяется с целевым.
 * @returns Объединенный объект.
 */
function mergeRecursive(target: any, source: any): any {
  try {
    for (const key in source) {
      if (
        typeof source[key] === 'object' && source[key] !== null &&
        !Array.isArray(source[key])
      ) {
        target[key] = mergeRecursive(target[key] || {}, source[key]);
      } else {
        target[key] = source[key];
      }
    }
    return target;
  } catch (error) {
    log.err(`Error merging configurations: ${error}`);
    throw error;
  }
}

/**
 * Объединяет две конфигурации.
 * @param parent Родительская конфигурация.
 * @param child Дочерняя конфигурация.
 * @returns Объединенная конфигурация.
 */
function mergeConfigs(
  parent: ITunerConfig,
  child: ITunerConfig,
): ITunerConfig {
  try {
    const mergedEnv = { ...parent.env, ...child.env };
    const mergedConfig = mergeRecursive(parent.data, child.data);
    return { ...child, env: mergedEnv, data: mergedConfig };
  } catch (error) {
    log.err(
      `Error merging parent and child configurations: ${error}`,
    );
    throw error;
  }
}

/**
 * Рекурсивно получает последовательность конфигураций от дочернего к родительскому.
 * @param curConfig Текущая конфигурация.
 * @param store Массив, в который сохраняются полученные конфигурации.
 * @param configDirName Имя директории конфигурации.
 * @param configDirPath Путь к директории конфигурации.
 * @returns Массив с последовательностью конфигураций от дочернего к родительскому.
 */
async function inheritList(
  curConfig: ITunerConfig,
  store: ConfigList = {},
  configDirName: string = 'config',
  configDirPath: string = './',
): Promise<ConfigList> {
  try {
    const resolvedPath = resolve(
      configDirPath,
      configDirName,
      `${getEnv('config')}.tuner.ts`,
    );
    store[0] = {
      config: curConfig,
      delivery: async () => {
        return await Load.local.absolutePath(
          `file:///${resolvedPath}`,
        ).fun();
      },
    };
    let i = 0;
    while (curConfig.child) {
      const childConfig = await curConfig.child.fun();
      store[--i] = {
        config: childConfig,
        delivery: curConfig.child.fun,
      };
      curConfig = childConfig;
    }
    i = 0;
    curConfig = store[0].config;
    while (curConfig.parent) {
      const parentConfig = await curConfig.parent.fun();
      store[++i] = {
        config: parentConfig,
        delivery: curConfig.parent.fun,
      };
      curConfig = parentConfig;
    }
    return store;
  } catch (error) {
    log.err(`Error inheriting configuration list: ${error}`);
    throw error;
  }
}

/**
 * Объединяет последовательность конфигураций по порядку от меньшего к большему.
 * @param configs Массив с последовательностью конфигураций.
 * @returns Объединенная конфигурация.
 */
async function mergeSequentialConfigs(
  configs: ConfigList,
): Promise<ITunerConfig> {
  try {
    let mergedConfig: ITunerConfig | null = null;
    const sortedKeys = Object.keys(configs).sort((a, b) => +b - +a);
    for (const key of sortedKeys) {
      const currentConfig = configs[Number(key)].config;

      if (mergedConfig === null) {
        mergedConfig = currentConfig;
      } else {
        mergedConfig = mergeConfigs(mergedConfig, currentConfig);
      }
    }

    return mergedConfig as ITunerConfig;
  } catch (error) {
    log.err(`Error merging sequential configurations: ${error}`);
    throw error;
  }
}

/**
 * Возвращает объект конфигурации с расширенными типами для полей config и env, учитывая типы дочерних и родительских конфигураций.
 * @param cfg Объект конфигурации, содержащий поля config, env, а также опциональные поля child и parent.
 * @returns Объект конфигурации с расширенными типами для полей config и env.
 * @template T Тип объекта конфигурации.
 */
export default function tune<T extends ITunerConfig>(
  cfg: T,
): DeepExpand<CombinedConfigType<T>> {
  return cfg as any;
}
