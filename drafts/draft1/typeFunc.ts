import { string } from 'https://deno.land/x/zod@v3.21.4/types.ts';

const orNumber = (value: number) => () => value;

const orString = (value: string) => () => value;

const orBool = (value: boolean) => () => value;

const jsonOrExit = () => () => true;

const stringOrExit = () => () => true;

export { jsonOrExit, orBool, orNumber, orString, stringOrExit };

type getRemote<T> = (
  options: { [key: string]: unknown },
) => Promise<string | T>;

// Тут пока побудет
export interface ITunerConfig {
  parent?: string | getRemote<ITunerConfig>;
  child?: string | getRemote<ITunerConfig>;
  env?: {
    [key: string]: unknown;
  };

  config?: {};
}
