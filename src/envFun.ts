import { criticalError, missingConfigNameEnv } from './error.ts';
import { getEnv } from './tuner.ts';

const getStringOrDefault = (value: string) => {
  return (envValue: string) => {
    try {
      return getEnv(envValue);
    } catch (e: unknown) {
      if (e instanceof missingConfigNameEnv) {
        return value;
      }
      throw new criticalError((e as { message: string }).message);
    }
  };
};

const getNumberOrDefault = (value: number) => {
  return (envValue: string) => {
    try {
      return Number(getEnv(envValue));
    } catch (e: unknown) {
      if (e instanceof missingConfigNameEnv) {
        return value;
      }
      throw new criticalError((e as { message: string }).message);
    }
  };
};

const getBooleanOrDefault = (value: boolean) => {
  return (envValue: string) => {
    try {
      return getEnv(envValue).toLowerCase() === 'true' ||
        getEnv(envValue) === '1';
    } catch (e: unknown) {
      if (e instanceof missingConfigNameEnv) {
        return value;
      }
      throw new criticalError((e as { message: string }).message);
    }
  };
};

const getStringOrExit = () => {
  return (envValue: string) => {
    try {
      return getEnv(envValue);
    } catch (e: unknown) {
      if (e instanceof missingConfigNameEnv) {
        Deno.exit(1);
      }
      throw new criticalError((e as { message: string }).message);
    }
  };
};

const getNumberOrExit = () => {
  return (envValue: string) => {
    try {
      return Number(getEnv(envValue));
    } catch (e: unknown) {
      if (e instanceof missingConfigNameEnv) {
        Deno.exit(1);
      }
      throw new criticalError((e as { message: string }).message);
    }
  };
};

const getBooleanOrExit = () => {
  return (envValue: string) => {
    try {
      const val = getEnv(envValue);
      return val.toLowerCase() === 'true' || val === '1';
    } catch (e: unknown) {
      if (e instanceof missingConfigNameEnv) {
        Deno.exit(1);
      }
      throw new criticalError((e as { message: string }).message);
    }
  };
};

const getStringOrThrow = <T extends Error>(error: T) => {
  return (envValue: string) => {
    try {
      return getEnv(envValue);
    } catch (e: unknown) {
      if (e instanceof missingConfigNameEnv) {
        throw error;
      }
      throw new criticalError((e as { message: string }).message);
    }
  };
};

const getNumberOrThrow = <T extends Error>(error: T) => {
  return (envValue: string) => {
    try {
      return Number(getEnv(envValue));
    } catch (e: unknown) {
      if (e instanceof missingConfigNameEnv) {
        throw error;
      }
      throw new criticalError((e as { message: string }).message);
    }
  };
};

const getBooleanOrThrow = <T extends Error>(error: T) => {
  return (envValue: string) => {
    try {
      const val = getEnv(envValue);
      return val.toLowerCase() === 'true' || val === '1';
    } catch (e: unknown) {
      if (e instanceof missingConfigNameEnv) {
        throw error;
      }
      throw new criticalError((e as { message: string }).message);
    }
  };
};

const getStringOrCompute = async (compute: () => Promise<string>) => {
  return async (envValue: string) => {
    try {
      return getEnv(envValue);
    } catch (e: unknown) {
      if (e instanceof missingConfigNameEnv) {
        return await compute();
      }
      throw new criticalError((e as { message: string }).message);
    }
  };
};

const getNumberOrCompute = async (compute: () => Promise<number>) => {
  return async (envValue: string) => {
    try {
      return Number(getEnv(envValue));
    } catch (e: unknown) {
      if (e instanceof missingConfigNameEnv) {
        return await compute();
      }
      throw new criticalError((e as { message: string }).message);
    }
  };
};

const getBooleanOrCompute = async (
  compute: () => Promise<boolean>,
) => {
  return async (envValue: string) => {
    try {
      const val = getEnv(envValue);
      return val.toLowerCase() === 'true' || val === '1';
    } catch (e: unknown) {
      if (e instanceof missingConfigNameEnv) {
        return await compute();
      }
      throw new criticalError((e as { message: string }).message);
    }
  };
};

const getNumber = {
  orDefault: getNumberOrDefault,
  orExit: getNumberOrExit,
  orCompute: getNumberOrCompute,
  orThrow: getNumberOrThrow,
};

const getString = {
  orDefault: getStringOrDefault,
  orExit: getStringOrExit,
  orCompute: getStringOrCompute,
  orThrow: getStringOrThrow,
};

const getBoolean = {
  orDefault: getBooleanOrDefault,
  orExit: getBooleanOrExit,
  orCompute: getBooleanOrCompute,
  orThrow: getBooleanOrThrow,
};

export default { getString, getNumber, getBoolean, getEnv };
