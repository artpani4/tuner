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

type ParentOrChild = {
  fun: () => Promise<ITunerConfig>;
  args: any;
};

// () => Promise<{ fun: ITunerConfig; args: string; }>

export interface ITunerConfig {
  parent?: ParentOrChild;
  child?: ParentOrChild;
  env?: {
    [key: string]: EnvFun | EnvAsyncFun | Primitive;
  };

  config?: {};
  watch?: number;
}

export interface IFilledTunerConfig {
  parent?: ParentOrChild;
  child?: ParentOrChild;
  env?: {
    [key: string]: Primitive;
  };

  config?: {};
  watch?: number;
}
