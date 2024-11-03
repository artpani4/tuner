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
  /**
   * Путь к директории конфигурации, по умолчанию './config'.
   */
  configDirPath?: string;

  /**
   * Имя конфигурации, например, 'dev', 'prod' и т.д.
   * Используется для указания конкретной среды.
   */
  configName?: string;
  useAbsolutPath?: boolean;
}


/**
 * Получает значение переменной окружения по указанному имени.
 * Если переменная окружения не задана, генерирует исключение MissingConfigNameEnv.
 * @param name Имя переменной окружения.
 * @returns Значение переменной окружения в виде строки.
 * @throws MissingConfigNameEnv Если переменная окружения не задана.
 */
export function getEnv(name: string): string {
  const value = Deno.env.get(name);
  if (value === undefined) {
    log.err(`Переменная окружения ${name} не задана`);
    throw new MissingConfigNameEnv(name);
  }
  log.inf(`Переменная окружения ${name} найдена со значением ${value}`);
  return value;
}

/**
 * Загружает и объединяет конфигурации, учитывая наследование.
 * @param options Опции для загрузки конфигурации, включая директорию и имя конфигурации.
 * @returns Объединенная и заполненная конфигурация.
 * @throws Error при ошибке загрузки конфигурации.
 */
export async function loadConfig<T>(options: LoadConfigOptions = {}): Promise<T> {
  try {
    const configDirPath = options.configDirPath || './config';
    const configName = options.configName || 'base';
    const useAbsolutPath = options.useAbsolutPath ?? true; // по умолчанию true
    
    const resolvedPath = resolve(configDirPath, `${configName}.tuner.ts`);
    log.inf(`Загрузка основной конфигурации из пути: ${resolvedPath}`);
    
    const mainConfig = await Load.local.absolutePath(resolvedPath, useAbsolutPath).fun();
    log.inf(`Основная конфигурация загружена: ${JSON.stringify(mainConfig)}`);
   
    const configSequence = await inheritList(mainConfig, {}, configDirPath, useAbsolutPath);
    log.inf(`Последовательность конфигураций: ${JSON.stringify(configSequence, null, 2)}`);

    const mergedConfig = await mergeSequentialConfigs(configSequence);
    log.inf(`Объединенная конфигурация: ${JSON.stringify(mergedConfig)}`);

    return fillEnv(mergedConfig) as T;
  } catch (error) {
    log.err(`Ошибка загрузки конфигурации: ${error}`);
    throw error;
  }
}


/**
 * Заполняет значения переменных окружения в конфигурации, если они определены как функции.
 * @param config Конфигурация с функциями в поле env.
 * @returns Конфигурация с заполненными значениями переменных окружения.
 */
function fillEnv(config: ITunerConfig): IFilledTunerConfig {
  try {
    const filledEnv: { [key: string]: any } = {};
    for (const key in config.env) {
      const value = config.env[key];
      filledEnv[key] = typeof value === 'function' ? value(key) : value;
    }
    log.inf(`Переменные окружения заполнены: ${JSON.stringify(filledEnv)}`);
    return { ...config, env: filledEnv };
  } catch (error) {
    log.err(`Ошибка заполнения переменных окружения: ${error}`);
    throw error;
  }
}

/**
 * Рекурсивно объединяет два объекта конфигурации.
 * @param target Целевой объект, в который происходит объединение.
 * @param source Исходный объект, объединяемый с целевым.
 * @returns Объединенный объект.
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
 * @param parent Родительская конфигурация.
 * @param child Дочерняя конфигурация.
 * @returns Объединенная конфигурация.
 */
function mergeConfigs(parent: ITunerConfig, child: ITunerConfig): ITunerConfig {
  try {
    const mergedEnv = { ...parent.env, ...child.env };
    const mergedData = mergeRecursive(parent.data || {}, child.data || {});
    log.inf(`Конфигурации объединены: ${JSON.stringify({ env: mergedEnv, data: mergedData })}`);
    return { env: mergedEnv, data: mergedData };
  } catch (error) {
    log.err(`Ошибка объединения конфигураций: ${error}`);
    throw error;
  }
}

/**
 * Получает последовательность конфигураций от дочернего к родительскому, учитывая наследование.
 * @param curConfig Текущая конфигурация.
 * @param store Массив, в который сохраняются полученные конфигурации.
 * @param configDirPath Путь к директории конфигурации.
 * @returns Массив с последовательностью конфигураций от дочернего к родительскому.
 */
async function inheritList(
  curConfig: ITunerConfig,
  store: ConfigList = {},
  configDirPath: string = './config',
  useAbsolutPath: boolean = true,
): Promise<ConfigList> {
  try {
    store[0] = { config: curConfig, delivery: () => curConfig };
    log.dbg(`Добавлена основная конфигурация: ${JSON.stringify(curConfig)}`);

    let i = 0;
    while (curConfig.child) {
      const childLoader = curConfig.child;
      let childConfig: ITunerConfig;
      log.inf(`Загрузка дочерней конфигурации: ${JSON.stringify(childLoader)}`);

      if (childLoader.type === 'configDir') {
        childConfig = await Load.local.configDir(childLoader.args, configDirPath, useAbsolutPath).fun();
      } else if (childLoader.type === 'absolutePath') {
        childConfig = await Load.local.absolutePath(childLoader.args, useAbsolutPath).fun();
      } else {
        childConfig = await childLoader.fun();
      }

      store[--i] = {
        config: childConfig,
        delivery: () => Load.local.configDir(childConfig.child?.args || '', configDirPath, useAbsolutPath).fun(),
      };
      log.dbg(`Добавлена дочерняя конфигурация: ${JSON.stringify(childConfig)}`);

      curConfig = childConfig;
    }

    i = 0;
    curConfig = store[0].config;
    while (curConfig.parent) {
      const parentLoader = curConfig.parent;
      let parentConfig: ITunerConfig;
      log.inf(`Загрузка родительской конфигурации: ${JSON.stringify(parentLoader)}`);

      if (parentLoader.type === 'configDir') {
        parentConfig = await Load.local.configDir(parentLoader.args, configDirPath, useAbsolutPath).fun();
      } else if (parentLoader.type === 'absolutePath') {
        parentConfig = await Load.local.absolutePath(parentLoader.args, useAbsolutPath).fun();
      } else {
        parentConfig = await parentLoader.fun();
      }

      store[++i] = {
        config: parentConfig,
        delivery: () => Load.local.configDir(parentConfig.parent?.args || '', configDirPath, useAbsolutPath).fun(),
      };
      log.dbg(`Добавлена родительская конфигурация: ${JSON.stringify(parentConfig)}`);

      curConfig = parentConfig;
    }
    log.inf(`Финальная последовательность наследования конфигураций: ${JSON.stringify(store)}`);
    return store;
  } catch (error) {
    log.err(`Ошибка наследования конфигурации: ${error}`);
    throw error;
  }
}

/**
 * Объединяет последовательность конфигураций от дочерней к родительской.
 * @param configs Массив с последовательностью конфигураций.
 * @returns Объединенная конфигурация.
 */
async function mergeSequentialConfigs(configs: ConfigList): Promise<ITunerConfig> {
  try {
    let mergedConfig: ITunerConfig | null = null;
    const sortedKeys = Object.keys(configs).sort((a, b) => +b - +a);
    log.inf(`Объединение конфигураций в последовательности ключей: ${sortedKeys}`);

    for (const key of sortedKeys) {
      const currentConfig = configs[Number(key)].config;
      mergedConfig = mergedConfig === null ? currentConfig : mergeConfigs(mergedConfig, currentConfig);
    }
    log.inf(`Конечная объединенная конфигурация: ${JSON.stringify(mergedConfig)}`);
    return mergedConfig as ITunerConfig;
  } catch (error) {
    log.err(`Ошибка объединения последовательных конфигураций: ${error}`);
    throw error;
  }
}

/**
 * Возвращает объект конфигурации с расширенными типами для полей config и env.
 * @param cfg Объект конфигурации с полями config, env, child и parent.
 * @returns Объект конфигурации с расширенными типами.
 * @template T Тип объекта конфигурации.
 */
export default function tune<T extends ITunerConfig>(cfg: T): DeepExpand<CombinedConfigType<T>> {
  return cfg as any;
}
