/**
 * Тип для получения конфигурации удаленного ресурса.
 */
export type getRemote = () => Promise<ITunerConfig>;

/**
 * Примитивные типы данных.
 */
type Primitive = string | number | boolean | undefined;

/**
 * Тип функции для получения значения переменной окружения.
 */
type EnvFun = (envValue: string) => string | number | boolean | void;

/**
 * Тип асинхронной функции для получения значения переменной окружения.
 */
type EnvAsyncFun = (
  envValue: string,
) => Promise<string | number | boolean | void>;

/**
 * Тип для описания родительского или дочернего конфигурационного объекта.
 */
type ParentOrChild = {
  fun: () => Promise<ITunerConfig>;
  args: any;
};

/**
 * Интерфейс для конфигурационного объекта Tuner.
 */
export interface ITunerConfig {
  parent?: ParentOrChild;
  child?: ParentOrChild;
  env?: {
    [key: string]: EnvFun | EnvAsyncFun | Primitive;
  };
  data?: {};
}

/**
 * Интерфейс для заполненного конфигурационного объекта Tuner.
 */
export interface IFilledTunerConfig {
  parent?: ParentOrChild;
  child?: ParentOrChild;
  env?: {
    [key: string]: Primitive;
  };
  data?: {};
}

/**
 * Расширяет тип объекта.
 */
export type Expand<T> = T extends infer O ? { [K in keyof O]: O[K] }
  : never;

/**
 * Определяет тип значения переменной окружения.
 */
export type InferEnvType<T> = T extends (envValue: string) => infer R
  ? R
  : T;

/**
 * Рекурсивно расширяет тип объекта.
 */
export type DeepExpand<T> = T extends Primitive ? T
  : T extends Array<infer U> ? Array<DeepExpand<U>>
  : T extends object
    ? { [K in keyof T]: DeepExpand<InferEnvType<T[K]>> }
  : T;

/**
 * Объединяет два конфигурационных объекта.
 */
export type MergeConfigs<
  T extends ITunerConfig,
  U extends ITunerConfig,
> = {
  data: {
    [K in keyof T['data'] | keyof U['data']]: K extends
      keyof U['data'] ? U['data'][K]
      : K extends keyof T['data'] ? T['data'][K]
      : never;
  };
  env: {
    [K in keyof T['env'] | keyof U['env']]: K extends keyof U['env']
      ? U['env'][K]
      : K extends keyof T['env'] ? T['env'][K]
      : never;
  };
};

/**
 * Определяет тип конфигурации дочернего объекта.
 */
type ChildConfigType<T extends ITunerConfig> = T extends
  { child: { fun: () => Promise<infer U extends ITunerConfig> } } ? U
  : {};

/**
 * Определяет тип конфигурации родительского объекта.
 */
type ParentConfigType<T extends ITunerConfig> = T extends
  { parent: { fun: () => Promise<infer U extends ITunerConfig> } } ? U
  : {};

/**
 * Объединяет конфигурации дочернего и родительского объектов с текущей конфигурацией.
 */
export type CombinedConfigType<T extends ITunerConfig> =
  & MergeConfigs<ChildConfigType<T>, T>
  & MergeConfigs<ParentConfigType<T>, T>;

/**
 * Функция для создания конфигурации Tuner с объединением конфигураций дочернего и родительского объектов.
 * @param cfg Конфигурационный объект Tuner.
 * @returns Объединенная и расширенная конфигурация.
 */
export default function tune<T extends ITunerConfig>(
  cfg: T,
): DeepExpand<CombinedConfigType<T>> {
  return cfg as any;
}
