import { IFilledTunerConfig, ITunerConfig } from './type.ts';
import { config as dotenvConfig } from 'https://deno.land/x/dotenv/mod.ts';
import Load from './loadFun.ts';
import { missingConfigNameEnv } from './error.ts';

type configList = { [key: number]: ITunerConfig };

export function getEnv(name: string): string {
  const value = Deno.env.get(name) || dotenvConfig()[name];
  if (!value) {
    throw new missingConfigNameEnv(name);
  }
  return value; 
}

export async function loadConfig(): Promise<IFilledTunerConfig> {
  const configName = getEnv('config');
  const mainConfig =
    await (await Load.local.configDir(`${configName}.tuner.ts`)());
  const configSequence = await inheritList(mainConfig);
  const mergedConfig = mergeSequentialConfigs(configSequence);
  return fillEnv(mergedConfig);
}

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

function mergeConfigs(
  parent: ITunerConfig,
  child: ITunerConfig,
): ITunerConfig {
  const mergedEnv = { ...parent.env, ...child.env };
  const mergedConfig = mergeRecursive(parent.config, child.config);
  return { ...child, env: mergedEnv, config: mergedConfig };
}

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
