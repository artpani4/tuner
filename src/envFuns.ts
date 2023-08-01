import { CriticalError, MissingConfigNameEnv } from './errors.ts';
import { getEnv } from './tuner.ts';

const getStringOrDefault = (value: string) => {
  return (envValue: string) => {
    try {
      return getEnv(envValue);
    } catch (e: unknown) {
      if (e instanceof MissingConfigNameEnv) {
        return value;
      }
      throw new CriticalError((e as { message: string }).message);
    }
  };
};

const getNumberOrDefault = (value: number) => {
  return (envValue: string) => {
    try {
      return Number(getEnv(envValue));
    } catch (e: unknown) {
      if (e instanceof MissingConfigNameEnv) {
        return value;
      }
      throw new CriticalError((e as { message: string }).message);
    }
  };
};

const getBooleanOrDefault = (value: boolean) => {
  return (envValue: string) => {
    try {
      return getEnv(envValue).toLowerCase() === 'true' ||
        getEnv(envValue) === '1';
    } catch (e: unknown) {
      if (e instanceof MissingConfigNameEnv) {
        return value;
      }
      throw new CriticalError((e as { message: string }).message);
    }
  };
};

const getStringOrExit = (exitMessage?: string) => {
  return (envValue: string) => {
    try {
      return getEnv(envValue);
    } catch (e: unknown) {
      if (e instanceof MissingConfigNameEnv) {
        if (exitMessage) {
          console.error(exitMessage);
        }
        Deno.exit(1);
      }
      throw new CriticalError((e as { message: string }).message);
    }
  };
};

const getNumberOrExit = (exitMessage?: string) => {
  return (envValue: string) => {
    try {
      return Number(getEnv(envValue));
    } catch (e: unknown) {
      if (e instanceof MissingConfigNameEnv) {
        if (exitMessage) {
          console.error(exitMessage);
        }
        Deno.exit(1);
      }
      throw new CriticalError((e as { message: string }).message);
    }
  };
};

const getBooleanOrExit = (exitMessage?: string) => {
  return (envValue: string) => {
    try {
      const val = getEnv(envValue);
      return val.toLowerCase() === 'true' || val === '1';
    } catch (e: unknown) {
      if (e instanceof MissingConfigNameEnv) {
        if (exitMessage) {
          console.error(exitMessage);
        }
        Deno.exit(1);
      }
      throw new CriticalError((e as { message: string }).message);
    }
  };
};

const getStringOrThrow = <T extends Error>(error: T) => {
  return (envValue: string) => {
    try {
      return getEnv(envValue);
    } catch (e: unknown) {
      if (e instanceof MissingConfigNameEnv) {
        throw error;
      }
      throw new CriticalError((e as { message: string }).message);
    }
  };
};

const getNumberOrThrow = <T extends Error>(error: T) => {
  return (envValue: string) => {
    try {
      return Number(getEnv(envValue));
    } catch (e: unknown) {
      if (e instanceof MissingConfigNameEnv) {
        throw error;
      }
      throw new CriticalError((e as { message: string }).message);
    }
  };
};

const getBooleanOrThrow = <T extends Error>(error: T) => {
  return (envValue: string) => {
    try {
      const val = getEnv(envValue);
      return val.toLowerCase() === 'true' || val === '1';
    } catch (e: unknown) {
      if (e instanceof MissingConfigNameEnv) {
        throw error;
      }
      throw new CriticalError((e as { message: string }).message);
    }
  };
};

const getStringOrAsyncCompute = (
  compute: () => Promise<string>,
) => {
  return async (envValue: string) => {
    try {
      return getEnv(envValue);
    } catch (e: unknown) {
      if (e instanceof MissingConfigNameEnv) {
        return await compute();
      }
      throw new CriticalError((e as { message: string }).message);
    }
  };
};

const getNumberOrAsyncCompute = (
  compute: () => Promise<number>,
) => {
  return async (envValue: string) => {
    try {
      return Number(getEnv(envValue));
    } catch (e: unknown) {
      if (e instanceof MissingConfigNameEnv) {
        return await compute();
      }
      throw new CriticalError((e as { message: string }).message);
    }
  };
};

const getBooleanOrAsyncCompute = (
  compute: () => Promise<boolean>,
) => {
  return async (envValue: string) => {
    try {
      const val = getEnv(envValue);
      return val.toLowerCase() === 'true' || val === '1';
    } catch (e: unknown) {
      if (e instanceof MissingConfigNameEnv) {
        return await compute();
      }
      throw new CriticalError((e as { message: string }).message);
    }
  };
};

const getStringOrCompute = (
  compute: () => string,
) => {
  return (envValue: string) => {
    try {
      return getEnv(envValue);
    } catch (e: unknown) {
      if (e instanceof MissingConfigNameEnv) {
        return compute();
      }
      throw new CriticalError((e as { message: string }).message);
    }
  };
};

const getNumberOrCompute = (
  compute: () => number,
) => {
  return (envValue: string) => {
    try {
      return Number(getEnv(envValue));
    } catch (e: unknown) {
      if (e instanceof MissingConfigNameEnv) {
        return compute();
      }
      throw new CriticalError((e as { message: string }).message);
    }
  };
};

const getBooleanOrCompute = (
  compute: () => boolean,
) => {
  return (envValue: string) => {
    try {
      const val = getEnv(envValue);
      return val.toLowerCase() === 'true' || val === '1';
    } catch (e: unknown) {
      if (e instanceof MissingConfigNameEnv) {
        return compute();
      }
      throw new CriticalError((e as { message: string }).message);
    }
  };
};

const getNumber = {
  orDefault: getNumberOrDefault,
  orExit: getNumberOrExit,
  orAsyncCompute: getNumberOrAsyncCompute,
  orCompute: getNumberOrCompute,
  orThrow: getNumberOrThrow,
  orNothing: () => () => {},
};

const getString = {
  orDefault: getStringOrDefault,
  orExit: getStringOrExit,
  orAsyncCompute: getStringOrAsyncCompute,
  orCompute: getStringOrCompute,
  orThrow: getStringOrThrow,
  orNothing: () => () => {},
};

const getBoolean = {
  orDefault: getBooleanOrDefault,
  orExit: getBooleanOrExit,
  orAsyncCompute: getBooleanOrAsyncCompute,
  orCompute: getBooleanOrCompute,
  orThrow: getBooleanOrThrow,
  orNothing: () => () => {},
};

export default { getString, getNumber, getBoolean };
