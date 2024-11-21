import {
  CombinedConfigType,
  DeepExpand,
  IFilledTunerConfig,
  ITunerConfig,
} from './type.ts';
import { MissingConfigNameEnv } from './errors.ts';
import { Load } from './loaders.ts';

import { resolvePath } from './utils/pathResolver.ts';
import { luminous } from './deps.ts';

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

/**
 * Options for loading the configuration.
 */
interface LoadConfigOptions {
  configDirPath?: string;
  configName?: string;
  absolutePathPrefix?: string;
  add_salt_to_path?: boolean;
}

/**
 * Gets the value of an environment variable by name.
 */
export function getEnv(name: string): string {
  const value = Deno.env.get(name);
  if (value === undefined) {
    log.err(`Environment variable not found: ${name}`);
    throw new MissingConfigNameEnv(name);
  }

  return value;
}

/**
 * Loads and merges configurations, taking inheritance into account.
 */
export async function loadConfig<T>(
  options: LoadConfigOptions = {},
): Promise<T> {
  try {
    const configDirPath = options.configDirPath || './config';
    const configName = options.configName || 'base';
    const addSalt = options.add_salt_to_path ?? false;

    const resolvedPath = resolvePath(
      `${configDirPath}/${configName}.tuner.ts`,
      options.absolutePathPrefix,
      addSalt,
    );

    // log.inf(
    //   `Loading main configuration from path: ${resolvedPath}`,
    // );
    const mainConfig = (await import(resolvedPath))
      .default as ITunerConfig;

    const configSequence = await inheritList(
      mainConfig,
      {},
      configDirPath,
      options.absolutePathPrefix,
      addSalt,
    );

    const mergedConfig = await mergeSequentialConfigs(configSequence);

    return fillEnv(mergedConfig) as T;
  } catch (error) {
    log.err(`Configuration loading error: ${error}`);
    throw error;
  }
}

/**
 * Fills environment variables into the configuration.
 */
function fillEnv(config: ITunerConfig): IFilledTunerConfig {
  try {
    const filledEnv: { [key: string]: any } = {};
    for (const key in config.env) {
      const value = config.env[key];
      filledEnv[key] = typeof value === 'function'
        ? value(key)
        : value;
    }

    return { ...config, env: filledEnv };
  } catch (error) {
    log.err(`Error filling environment variables: ${error}`);
    throw error;
  }
}

/**
 * Recursively merges two configuration objects.
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
    log.err(`Configuration merge error: ${error}`);
    throw error;
  }
}

/**
 * Merges two configurations, including data and environment variables.
 */
function mergeConfigs(
  parent: ITunerConfig,
  child: ITunerConfig,
): ITunerConfig {
  try {
    const mergedEnv = { ...parent.env, ...child.env };
    const mergedData = mergeRecursive(
      parent.data || {},
      child.data || {},
    );

    return { env: mergedEnv, data: mergedData };
  } catch (error) {
    log.err(`Configuration merge error: ${error}`);
    throw error;
  }
}

/**
 * Gets the sequence of configurations from child to parent.
 */
async function inheritList(
  curConfig: ITunerConfig,
  store: ConfigList = {},
  configDirPath: string = './config',
  absolutePathPrefix?: string,
  addSalt: boolean = false,
): Promise<ConfigList> {
  try {
    store[0] = { config: curConfig, delivery: () => curConfig };

    let i = 0;
    while (curConfig.child) {
      const childLoader = curConfig.child;
      let childConfig: ITunerConfig;

      if (childLoader.type === 'configDir') {
        childConfig = await Load.local.configDir(
          childLoader.args,
          configDirPath,
          absolutePathPrefix,
          addSalt,
        ).fun();
      } else if (childLoader.type === 'absolutePath') {
        childConfig = await Load.local.absolutePath(
          childLoader.args,
          absolutePathPrefix,
          addSalt,
        ).fun();
      } else {
        childConfig = await childLoader.fun();
      }

      store[--i] = {
        config: childConfig,
        delivery: () =>
          Load.local.configDir(
            childConfig.child?.args || '',
            configDirPath,
            absolutePathPrefix,
            addSalt,
          ).fun(),
      };
      curConfig = childConfig;
    }

    i = 0;
    curConfig = store[0].config;
    while (curConfig.parent) {
      const parentLoader = curConfig.parent;
      let parentConfig: ITunerConfig;

      if (parentLoader.type === 'configDir') {
        parentConfig = await Load.local.configDir(
          parentLoader.args,
          configDirPath,
          absolutePathPrefix,
          addSalt,
        ).fun();
      } else if (parentLoader.type === 'absolutePath') {
        parentConfig = await Load.local.absolutePath(
          parentLoader.args,
          absolutePathPrefix,
          addSalt,
        ).fun();
      } else {
        parentConfig = await parentLoader.fun();
      }

      store[++i] = {
        config: parentConfig,
        delivery: () =>
          Load.local.configDir(
            parentConfig.parent?.args || '',
            configDirPath,
            absolutePathPrefix,
            addSalt,
          ).fun(),
      };

      curConfig = parentConfig;
    }

    return store;
  } catch (error) {
    log.err(`Configuration inheritance error: ${error}`);
    throw error;
  }
}

/**
 * Merges a sequence of configurations from child to parent.
 */
async function mergeSequentialConfigs(
  configs: ConfigList,
): Promise<ITunerConfig> {
  try {
    let mergedConfig: ITunerConfig | null = null;
    const sortedKeys = Object.keys(configs).sort((a, b) => +b - +a);

    for (const key of sortedKeys) {
      const currentConfig = configs[Number(key)].config;
      mergedConfig = mergedConfig === null
        ? currentConfig
        : mergeConfigs(mergedConfig, currentConfig);
    }

    return mergedConfig as ITunerConfig;
  } catch (error) {
    log.err(
      `Error merging sequential configurations: ${error}`,
    );
    throw error;
  }
}

export default function tune<T extends ITunerConfig>(
  cfg: T,
): DeepExpand<CombinedConfigType<T>> {
  return cfg as any;
}
