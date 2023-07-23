type getRemote<T> = (
  options: { [key: string]: unknown },
) => Promise<string | T>;

type envFun = (envValue: string) => string | number | boolean;
type envAsyncFun = (
  envValue: string,
) => Promise<string | number | boolean>;

// Тут пока побудет
export interface ITunerConfig {
  parent?: string | getRemote<ITunerConfig>;
  child?: string | getRemote<ITunerConfig>;
  env?: {
    [key: string]: envFun | envAsyncFun;
  };

  config?: {};
}

export interface IFilledTunerConfig {
  parent?: string | getRemote<ITunerConfig>;
  child?: string | getRemote<ITunerConfig>;
  env?: {
    [key: string]: string | number | boolean;
  };

  config?: {};
}
