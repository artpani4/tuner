import { walk } from 'https://deno.land/std@0.164.0/fs/walk.ts';
import { ITunerConfig } from './typeFunc.ts';
import { resolve } from 'https://deno.land/std@0.195.0/path/posix.ts';
import { findDirectoryInCWD } from './pathHelper.ts';

const fromAbsolutePath = (path: string) => {
  return async () => {
    return (await import(path)).default as ITunerConfig;
  };
};

const fromConfigDir = (path: string) => {
  return async () => {
    const configDir = await findDirectoryInCWD('config');
    if (configDir === null) {
      throw new Error('config directory not found');
    }
    return (await import(`${resolve(configDir, path)}`))
      .default as ITunerConfig;
  };
};

const fromCWD = (path: string) => async () => {
  return (await import(resolve(Deno.cwd(), path)))
    .default as ITunerConfig;
};

async function importFromString(code: string) {
  const module = await import(
    `data:application/typescript;base64,${btoa(code)}`
  );
  return module.default;
}

const remoteAsString = (cb: () => Promise<string>) => async () => {
  return await importFromString(await cb()) as ITunerConfig;
};

const remoteAsModule =
  (cb: () => Promise<{ default: ITunerConfig }>) => async () => {
    return (await cb()).default as ITunerConfig;
  };

const Load = {
  fromAbsolutePath,
  fromConfigDir,
  fromCWD,
  remoteAsString,
  remoteAsModule,
};

export default Load;
