export type getRemote = () => Promise<ITunerConfig>;

type envFun = (envValue: string) => string | number | boolean;
type envAsyncFun = (
  envValue: string,
) => Promise<string | number | boolean>;

type loadAsyncFun = (path: string) =>
  | Promise<ITunerConfig>
  | ((
    cb: () => Promise<{ default: ITunerConfig }>,
  ) => Promise<ITunerConfig>);

export interface ITunerConfig {
  parent?: () => Promise<ITunerConfig>;
  child?: () => Promise<ITunerConfig>;
  env?: {
    [key: string]: envFun | envAsyncFun;
  };

  config?: {};
}

export interface IFilledTunerConfig {
  parent?: loadAsyncFun;
  child?: loadAsyncFun;
  env?: {
    [key: string]: string | number | boolean;
  };

  config?: {};
}
