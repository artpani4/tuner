import { IFilledTunerConfig, ITunerConfig } from './type.ts';
import { config as dotenvConfig } from 'https://deno.land/x/dotenv/mod.ts';
import Load from './loaders.ts';
import { MissingConfigNameEnv } from './errors.ts';

type configList = { [key: number]: ITunerConfig };

/**
 * Получает значение переменной окружения по указанному имени.
 * Если переменная окружения не задана, то пытается получить значение из файла .env.
 * @param name Имя переменной окружения.
 * @returns Значение переменной окружения.
 * @throws {MissingConfigNameEnv} Если переменная окружения не задана и отсутствует в файле .env.
 */
export function getEnv(name: string): string {
  const value = Deno.env.get(name) || dotenvConfig()[name];
  if (!value) {
    throw new MissingConfigNameEnv(name);
  }
  return value;
}

/**
 * Загружает и объединяет конфигурации из нескольких источников, указанных в порядке наследования.
 * @returns Объединенная и заполненная конфигурация.
 */
export async function loadConfig(): Promise<IFilledTunerConfig> {
  const configName = getEnv('config');
  const mainConfig =
    await (await Load.local.configDir(`${configName}.tuner.ts`)());
  const configSequence = await inheritList(mainConfig);
  const mergedConfig = mergeSequentialConfigs(configSequence);
  return fillEnv(mergedConfig);
}

/**
 * Заполняет значения переменных окружения в конфигурации, если они являются функциями.
 * @param config Конфигурация с функциями в поле env.
 * @returns Конфигурация с заполненными значениями переменных окружения.
 */
function fillEnv(config: ITunerConfig): IFilledTunerConfig {
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
}

/**
 * Рекурсивно объединяет два объекта.
 * @param target Целевой объект, в который происходит объединение.
 * @param source Исходный объект, который объединяется с целевым.
 * @returns Объединенный объект.
 */
function mergeRecursive(target: any, source: any): any {
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
  const mergedEnv = { ...parent.env, ...child.env };
  const mergedConfig = mergeRecursive(parent.config, child.config);
  return { ...child, env: mergedEnv, config: mergedConfig };
}

/**
 * Рекурсивно получает последовательность конфигураций от дочернего к родительскому.
 * @param curConfig Текущая конфигурация.
 * @param store Массив, в который сохраняются полученные конфигурации.
 * @returns Массив с последовательностью конфигураций от дочернего к родительскому.
 */
async function inheritList(
  curConfig: ITunerConfig,
  store: configList = {},
): Promise<configList> {
  store[0] = curConfig;
  let i = 0;
  while (curConfig.child) {
    const childConfig = await curConfig.child();
    store[--i] = childConfig;
    curConfig = childConfig;
  }
  i = 0;
  curConfig = store[0];
  while (curConfig.parent) {
    const parentConfig = await curConfig.parent();
    store[++i] = parentConfig;
    curConfig = parentConfig;
  }
  return store;
}

/**
 * Объединяет последовательность конфигураций по порядку от меньшего к большему.
 * @param configs Массив с последовательностью конфигураций.
 * @returns Объединенная конфигурация.
 */
function mergeSequentialConfigs(configs: configList): ITunerConfig {
  let mergedConfig: ITunerConfig | null = null;
  const sortedKeys = Object.keys(configs).sort((a, b) => +b - +a);
  for (const key of sortedKeys) {
    const currentConfig = configs[Number(key)];

    if (mergedConfig === null) {
      mergedConfig = currentConfig;
    } else {
      mergedConfig = mergeConfigs(mergedConfig, currentConfig);
    }
  }

  return mergedConfig as ITunerConfig;
}
