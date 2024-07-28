import { IFilledTunerConfig, ITunerConfig } from './type.ts';
import { config as dotenvConfig } from 'https://deno.land/x/dotenv/mod.ts';
import Load from './loaders.ts';
import { MissingConfigNameEnv } from './errors.ts';
import { Ward, WardEventData } from './ward/ward.ts';
import { eventEmitter } from './ward/eventManager.ts';

type ConfigList = {
  [key: number]: {
    config: ITunerConfig;
    delivery: () =>
      | ITunerConfig
      | Promise<ITunerConfig>
      | IFilledTunerConfig
      | Promise<IFilledTunerConfig>;
    // args?: any;
  };
};

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
    await (await Load.local.configDir(`${configName}.tuner.ts`)
      .fun());
  eventEmitter.removeAllListeners(
    'STOP_ALL_WARDS',
  );
  Ward.stopAllWards();
  const configSequence = await inheritList(mainConfig);
  const mergedConfig = mergeSequentialConfigs(configSequence);
  return fillEnv(await mergedConfig);
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
  store: ConfigList = {},
): Promise<ConfigList> {
  store[0] = {
    config: curConfig,
    delivery: async () => {
      return await Load.local.configDir(
        `${getEnv('config')}.tuner.ts`,
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
}

/**
 * Объединяет последовательность конфигураций по порядку от меньшего к большему.
 * @param configs Массив с последовательностью конфигураций.
 * @returns Объединенная конфигурация.
 */
async function mergeSequentialConfigs(
  configs: ConfigList,
): Promise<ITunerConfig> {
  let mergedConfig: ITunerConfig | null = null;
  const sortedKeys = Object.keys(configs).sort((a, b) => +b - +a);
  for (const key of sortedKeys) {
    // console.log(configs[Number(key)].config);
    const currentConfig = configs[Number(key)].config;
    if (currentConfig.watch) {
      // console.log('Начинаю наблюдение за конфигом:');
      // console.log(currentConfig);
      const ward = new Ward<IFilledTunerConfig>()
        .target.data.remote(
          configs[Number(key)].delivery as () => Promise<
            IFilledTunerConfig
          >,
        )
        .time(currentConfig.watch * 2)
        .ifChangedThen.emitEvent('CONFIG_CHANGE')
        .build();
      await ward.start();
    }
    if (mergedConfig === null) {
      mergedConfig = currentConfig;
    } else {
      mergedConfig = mergeConfigs(mergedConfig, currentConfig);
    }
  }

  return mergedConfig as ITunerConfig;
}

export async function onChangeTrigger<T>(
  cb: (data: WardEventData<T>) => void | Promise<void>,
) {
  eventEmitter.addListener('CONFIG_CHANGE', cb);
}

// function setWatching(
//   manager: EventManager,
//   config: ITunerConfig,
//   delivery: () => ITunerConfig | Promise<ITunerConfig>,
// ) {
// }
