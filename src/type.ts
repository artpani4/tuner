export type getRemote = () => Promise<ITunerConfig>;

type EnvFun = (envValue: string) => string | number | boolean;
type EnvAsyncFun = (
  envValue: string,
) => Promise<string | number | boolean>;

type LoadAsyncFun = (path: string) =>
  | Promise<ITunerConfig>
  | ((
    cb: () =>
      | Promise<{ default: ITunerConfig }>
      | Promise<ITunerConfig>,
  ) => Promise<ITunerConfig>);

export interface ITunerConfig {
  parent?: () => Promise<ITunerConfig>;
  child?: () => Promise<ITunerConfig>;
  env?: {
    [key: string]: EnvFun | EnvAsyncFun;
  };

  config?: {};
}

export interface IFilledTunerConfig {
  parent?: LoadAsyncFun;
  child?: LoadAsyncFun;
  env?: {
    [key: string]: string | number | boolean;
  };

  config?: {};
}
