import { ITunerConfig } from './type.ts';
import { resolve } from 'https://deno.land/std@0.195.0/path/posix.ts';
import { findDirectoryInCWD } from './pathHelper.ts';
import {
  getGitHubConfig,
  getNotionConfig,
} from '../provider/service.ts';

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
    const module = await import(`${resolve(configDir, path)}`);
    // console.log(module);
    return module
      .default as ITunerConfig;
  };
};

const fromCWD = (path: string) => async () => {
  return (await import(resolve(Deno.cwd(), path)))
    .default as ITunerConfig;
};

export async function importFromString(code: string) {
  const module = await import(
    `data:application/typescript;base64,${btoa(code)}`
  );
  return module;
}

const remoteAsString = (cb: () => Promise<string>) => async () => {
  return await importFromString(await cb()) as ITunerConfig;
};

const remoteAsModule =
  (cb: () => Promise<{ default: ITunerConfig }>) => async () => {
    return (await cb()).default as ITunerConfig;
  };

const notionLoad = (key: string, blockId: string) => () =>
  getNotionConfig(key, blockId);

const GithubLoad =
  (key: string, owner: string, repo: string, path: string) => () =>
    getGitHubConfig(key, owner, repo, path);

const Load = {
  local: {
    absolutePath: fromAbsolutePath,
    configDir: fromConfigDir,
    cwd: fromCWD,
  },
  remote: {
    import: remoteAsModule,
    callbackStringReturned: remoteAsString,
    notion: notionLoad,
    github: GithubLoad,
  },
};

export default Load;
