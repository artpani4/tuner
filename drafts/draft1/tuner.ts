import { IFilledTunerConfig, ITunerConfig } from './typeFunc.ts';
import { config as dotenvConfig } from 'https://deno.land/x/dotenv/mod.ts';
import { resolve } from 'https://deno.land/std@0.195.0/path/posix.ts';

import { walk } from 'https://deno.land/std/fs/mod.ts';
import { missingConfigNameEnv } from './error.ts';

export function getEnv(name: string): string {
  const value = Deno.env.get(name) || dotenvConfig()[name];
  if (!value) {
    throw new missingConfigNameEnv(name);
  }
  return value;
}

async function findDirectory(
  directoryPath: string,
  targetName: string,
): Promise<string | null> {
  for await (const entry of walk(directoryPath)) {
    if (entry.isDirectory && entry.name === targetName) {
      return entry.path;
    }
  }
  return null;
}

async function findDirectoryInCWD(
  name: string,
): Promise<string | null> {
  return findDirectory(Deno.cwd(), name);
}

export async function loadConfig(): Promise<void> {
  const configName = getEnv('config');
  const configDir = await findDirectoryInCWD('config');
  const configPath = `${configDir}/${configName}.tuner.ts`;
  const rawModule = await import(configPath);
  let rawConfig = rawModule.default as ITunerConfig;
  const finalParentCombined = await combineParent(
    rawConfig,
    configDir!,
  );
  console.log(finalParentCombined);
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
    if (typeof source[key] === 'object' && source[key] !== null) {
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

async function combineParent(
  child: ITunerConfig,
  configDirectory: string,
): Promise<ITunerConfig> {
  if (!child.parent) {
    return child;
  }

  const parentPath = resolve(configDirectory, child.parent as string);
  const parent = (await import(parentPath)).default as ITunerConfig;
  const newChild = mergeConfigs(parent, child);
  if (!parent.parent) return newChild;
  newChild.parent = parent.parent;
  return combineParent(newChild, configDirectory);
}
