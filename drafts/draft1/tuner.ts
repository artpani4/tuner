import {
  getRemote,
  IFilledTunerConfig,
  ITunerConfig,
} from './typeFunc.ts';
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

export async function loadConfig(): Promise<void> {
  const configName = getEnv('config');
  const mainConfig =
    await (await Load.fromConfigDir(`${configName}.tuner.ts`)());
  const configSequence = await inheritList(mainConfig);
  const mergedConfig = mergeSequentialConfigs(configSequence);
  console.log(fillEnv(mergedConfig));
  // const rawModule = await import(configPath);
  // let rawConfig = rawModule.default as ITunerConfig;
  // const finalParentCombined = await combineParent(
  //   rawConfig,
  //   configDir!,
  // );
  // console.log(finalParentCombined);
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

// async function combineParent(
//   child: ITunerConfig,
//   configDirectory: string,
// ): Promise<ITunerConfig> {
//   if (!child.parent) {
//     return child;
//   }

//   const parentPath = resolve(configDirectory, child.parent as string);
//   const parent = (await import(parentPath)).default as ITunerConfig;
//   const newChild = mergeConfigs(parent, child);
//   console.log(newChild);
//   console.log('----------------');
//   if (!parent.parent) return newChild;
//   newChild.parent = parent.parent;
//   return combineParent(newChild, configDirectory);
// }

// async function loadModule(ref: getRemote) {
//   const remote = await ref();
//   return (await ref()) as ITunerConfig;
// }

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
  // Проходимся по отсортированным ключам
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
