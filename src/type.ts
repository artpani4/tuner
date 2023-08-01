export type getRemote = () => Promise<ITunerConfig>;

type Primitive = string | number | boolean;
type EnvFun = (envValue: string) => string | number | boolean | void;
type EnvAsyncFun = (
  envValue: string,
) => Promise<string | number | boolean | void>;

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
    [key: string]: EnvFun | EnvAsyncFun | Primitive;
  };

  config?: {};
}

export interface IFilledTunerConfig {
  parent?: LoadAsyncFun;
  child?: LoadAsyncFun;
  env?: {
    [key: string]: Primitive;
  };

  config?: {};
}
