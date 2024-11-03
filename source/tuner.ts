// source/tuner.ts

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

const loggerOptions = new luminous.OptionsBuilder().setName('TUNER').build();
const log = new luminous.Logger(loggerOptions);

type ConfigList = {
  [key: number]: {
    config: ITunerConfig;
    delivery: () => ITunerConfig | Promise<ITunerConfig> | IFilledTunerConfig | Promise<IFilledTunerConfig>;
  };
};

/**
 * Опции для загрузки конфигурации.
 */
interface LoadConfigOptions {
  configDirPath?: string;
  configName?: string;
  absolutePathPrefix?: string;
}

/**
 * Получает значение переменной окружения по указанному имени.
 */
export function getEnv(name: string): string {
  const value = Deno.env.get(name);
  if (value === undefined) {
    log.err(`Переменная окружения ${name} не задана`);
    throw new MissingConfigNameEnv(name);
  }

  return value;
}

/**
 * Загружает и объединяет конфигурации, учитывая наследование.
 */

export async function loadConfig<T>(options: LoadConfigOptions = {}): Promise<T> {
  try {
    const configDirPath = options.configDirPath || './config';
    const configName = options.configName || 'base';
    
  

    // Используем absolutePathPrefix, если он задан, относительно текущей директории
    const resolvedPath = options.absolutePathPrefix
      ? resolve( options.absolutePathPrefix, configDirPath, `${configName}.tuner.ts`)
      : resolve(configDirPath, `${configName}.tuner.ts`);
    

    
    const mainConfig = await Load.local.absolutePath(resolvedPath).fun();

    const configSequence = await inheritList(mainConfig, {}, configDirPath, options.absolutePathPrefix);


    const mergedConfig = await mergeSequentialConfigs(configSequence);


    return fillEnv(mergedConfig) as T;
  } catch (error) {
    log.err(`Ошибка загрузки конфигурации: ${error}`);
    throw error;
  }
}


/**
 * Заполняет значения переменных окружения в конфигурации.
 */
function fillEnv(config: ITunerConfig): IFilledTunerConfig {
  try {
    const filledEnv: { [key: string]: any } = {};
    for (const key in config.env) {
      const value = config.env[key];
      filledEnv[key] = typeof value === 'function' ? value(key) : value;
    }

    return { ...config, env: filledEnv };
  } catch (error) {
    log.err(`Ошибка заполнения переменных окружения: ${error}`);
    throw error;
  }
}

/**
 * Рекурсивно объединяет два объекта конфигурации.
 */
function mergeRecursive(target: any, source: any): any {
  try {
    for (const key in source) {
      if (typeof source[key] === 'object' && source[key] !== null && !Array.isArray(source[key])) {
        target[key] = mergeRecursive(target[key] || {}, source[key]);
      } else {
        target[key] = source[key];
      }
    }
    return target;
  } catch (error) {
    log.err(`Ошибка объединения конфигураций: ${error}`);
    throw error;
  }
}

/**
 * Объединяет две конфигурации, включая данные и переменные окружения.
 */
function mergeConfigs(parent: ITunerConfig, child: ITunerConfig): ITunerConfig {
  try {
    const mergedEnv = { ...parent.env, ...child.env };
    const mergedData = mergeRecursive(parent.data || {}, child.data || {});

    return { env: mergedEnv, data: mergedData };
  } catch (error) {
    log.err(`Ошибка объединения конфигураций: ${error}`);
    throw error;
  }
}

/**
 * Получает последовательность конфигураций от дочернего к родительскому.
 */
async function inheritList(
  curConfig: ITunerConfig,
  store: ConfigList = {},
  configDirPath: string = './config',
  absolutePathPrefix?: string,
): Promise<ConfigList> {
  try {

    store[0] = { config: curConfig, delivery: () => curConfig };

    let i = 0;
    while (curConfig.child) {
      const childLoader = curConfig.child;
      let childConfig: ITunerConfig;

      if (childLoader.type === 'configDir') {
        childConfig = await Load.local.configDir(childLoader.args, configDirPath, absolutePathPrefix).fun();
      } else if (childLoader.type === 'absolutePath') {
        childConfig = await Load.local.absolutePath(childLoader.args, absolutePathPrefix).fun();
      } else {
        childConfig = await childLoader.fun();
      }

      store[--i] = {
        config: childConfig,
        delivery: () => Load.local.configDir(childConfig.child?.args || '', configDirPath, absolutePathPrefix).fun(),
      };

      curConfig = childConfig;
    }

    i = 0;
    curConfig = store[0].config;
    while (curConfig.parent) {
      const parentLoader = curConfig.parent;
      let parentConfig: ITunerConfig;

      if (parentLoader.type === 'configDir') {
        parentConfig = await Load.local.configDir(parentLoader.args, configDirPath, absolutePathPrefix).fun();
      } else if (parentLoader.type === 'absolutePath') {
        parentConfig = await Load.local.absolutePath(parentLoader.args, absolutePathPrefix).fun();
      } else {
        parentConfig = await parentLoader.fun();
      }

      store[++i] = {
        config: parentConfig,
        delivery: () => Load.local.configDir(parentConfig.parent?.args || '', configDirPath, absolutePathPrefix).fun(),
      };

      curConfig = parentConfig;
    }

    return store;
  } catch (error) {
    log.err(`Ошибка наследования конфигурации: ${error}`);
    throw error;
  }
}

/**
 * Объединяет последовательность конфигураций от дочерней к родительской.
 */
async function mergeSequentialConfigs(configs: ConfigList): Promise<ITunerConfig> {
  try {
    let mergedConfig: ITunerConfig | null = null;
    const sortedKeys = Object.keys(configs).sort((a, b) => +b - +a);


    for (const key of sortedKeys) {
      const currentConfig = configs[Number(key)].config;
      mergedConfig = mergedConfig === null ? currentConfig : mergeConfigs(mergedConfig, currentConfig);
    }

    return mergedConfig as ITunerConfig;
  } catch (error) {
    log.err(`Ошибка объединения последовательных конфигураций: ${error}`);
    throw error;
  }
}

export default function tune<T extends ITunerConfig>(cfg: T): DeepExpand<CombinedConfigType<T>> {
  return cfg as any;
}
