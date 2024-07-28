import luminous from '@vseplet/luminous';

import { getEnv } from '../tuner.ts';
import { CriticalError, MissingConfigNameEnv } from '../errors.ts';

const loggerOptions = new luminous.OptionsBuilder().setName(
  'ENV_FUNS',
).build();
const log = new luminous.Logger(loggerOptions);

/**
 * Возвращает строковое значение переменной окружения или значение по умолчанию, если переменная отсутствует.
 * @param value Значение по умолчанию.
 * @returns Функция, возвращающая значение переменной окружения или значение по умолчанию.
 */
const getStringOrDefault = (value: string) => {
  return (envValue: string) => {
    try {
      return getEnv(envValue);
    } catch (e: unknown) {
      if (e instanceof MissingConfigNameEnv) {
        log.wrn(
          `Environment variable ${envValue} is missing. Using default value: ${value}`,
        );
        return value;
      }
      log.err(
        `Critical error occurred while getting environment variable ${envValue}: ${e}`,
      );
      throw new CriticalError((e as { message: string }).message);
    }
  };
};

/**
 * Возвращает числовое значение переменной окружения или значение по умолчанию, если переменная отсутствует.
 * @param value Значение по умолчанию.
 * @returns Функция, возвращающая значение переменной окружения или значение по умолчанию.
 */
const getNumberOrDefault = (value: number) => {
  return (envValue: string) => {
    try {
      return Number(getEnv(envValue));
    } catch (e: unknown) {
      if (e instanceof MissingConfigNameEnv) {
        log.wrn(
          `Environment variable ${envValue} is missing. Using default value: ${value}`,
        );
        return value;
      }
      log.err(
        `Critical error occurred while getting environment variable ${envValue}: ${e}`,
      );
      throw new CriticalError((e as { message: string }).message);
    }
  };
};

/**
 * Возвращает булевое значение переменной окружения или значение по умолчанию, если переменная отсутствует.
 * @param value Значение по умолчанию.
 * @returns Функция, возвращающая значение переменной окружения или значение по умолчанию.
 */
const getBooleanOrDefault = (value: boolean) => {
  return (envValue: string) => {
    try {
      return getEnv(envValue).toLowerCase() === 'true' ||
        getEnv(envValue) === '1';
    } catch (e: unknown) {
      if (e instanceof MissingConfigNameEnv) {
        log.wrn(
          `Environment variable ${envValue} is missing. Using default value: ${value}`,
        );
        return value;
      }
      log.err(
        `Critical error occurred while getting environment variable ${envValue}: ${e}`,
      );
      throw new CriticalError((e as { message: string }).message);
    }
  };
};

/**
 * Возвращает строковое значение переменной окружения или завершает процесс, если переменная отсутствует.
 * @param exitMessage Сообщение перед завершением процесса.
 * @returns Функция, возвращающая значение переменной окружения или завершающая процесс.
 */
const getStringOrExit = (exitMessage?: string) => {
  return (envValue: string) => {
    try {
      return getEnv(envValue);
    } catch (e: unknown) {
      if (e instanceof MissingConfigNameEnv) {
        if (exitMessage) {
          console.error(exitMessage);
          log.err(exitMessage);
        }
        Deno.exit(1);
      }
      log.err(
        `Critical error occurred while getting environment variable ${envValue}: ${e}`,
      );
      throw new CriticalError((e as { message: string }).message);
    }
  };
};

/**
 * Возвращает числовое значение переменной окружения или завершает процесс, если переменная отсутствует.
 * @param exitMessage Сообщение перед завершением процесса.
 * @returns Функция, возвращающая значение переменной окружения или завершающая процесс.
 */
const getNumberOrExit = (exitMessage?: string) => {
  return (envValue: string) => {
    try {
      return Number(getEnv(envValue));
    } catch (e: unknown) {
      if (e instanceof MissingConfigNameEnv) {
        if (exitMessage) {
          console.error(exitMessage);
          log.err(exitMessage);
        }
        Deno.exit(1);
      }
      log.err(
        `Critical error occurred while getting environment variable ${envValue}: ${e}`,
      );
      throw new CriticalError((e as { message: string }).message);
    }
  };
};

/**
 * Возвращает булевое значение переменной окружения или завершает процесс, если переменная отсутствует.
 * @param exitMessage Сообщение перед завершением процесса.
 * @returns Функция, возвращающая значение переменной окружения или завершающая процесс.
 */
const getBooleanOrExit = (exitMessage?: string) => {
  return (envValue: string) => {
    try {
      const val = getEnv(envValue);
      return val.toLowerCase() === 'true' || val === '1';
    } catch (e: unknown) {
      if (e instanceof MissingConfigNameEnv) {
        if (exitMessage) {
          console.error(exitMessage);
          log.err(exitMessage);
        }
        Deno.exit(1);
      }
      log.err(
        `Critical error occurred while getting environment variable ${envValue}: ${e}`,
      );
      throw new CriticalError((e as { message: string }).message);
    }
  };
};

/**
 * Возвращает строковое значение переменной окружения или генерирует исключение, если переменная отсутствует.
 * @param error Исключение, которое нужно сгенерировать.
 * @returns Функция, возвращающая значение переменной окружения или генерирующая исключение.
 */
const getStringOrThrow = <T extends Error>(error: T) => {
  return (envValue: string) => {
    try {
      return getEnv(envValue);
    } catch (e: unknown) {
      if (e instanceof MissingConfigNameEnv) {
        log.err(
          `Missing environment variable ${envValue}. Throwing error: ${error}`,
        );
        throw error;
      }
      log.err(
        `Critical error occurred while getting environment variable ${envValue}: ${e}`,
      );
      throw new CriticalError((e as { message: string }).message);
    }
  };
};

/**
 * Возвращает числовое значение переменной окружения или генерирует исключение, если переменная отсутствует.
 * @param error Исключение, которое нужно сгенерировать.
 * @returns Функция, возвращающая значение переменной окружения или генерирующая исключение.
 */
const getNumberOrThrow = <T extends Error>(error: T) => {
  return (envValue: string) => {
    try {
      return Number(getEnv(envValue));
    } catch (e: unknown) {
      if (e instanceof MissingConfigNameEnv) {
        log.err(
          `Missing environment variable ${envValue}. Throwing error: ${error}`,
        );
        throw error;
      }
      log.err(
        `Critical error occurred while getting environment variable ${envValue}: ${e}`,
      );
      throw new CriticalError((e as { message: string }).message);
    }
  };
};

/**
 * Возвращает булевое значение переменной окружения или генерирует исключение, если переменная отсутствует.
 * @param error Исключение, которое нужно сгенерировать.
 * @returns Функция, возвращающая значение переменной окружения или генерирующая исключение.
 */
const getBooleanOrThrow = <T extends Error>(error: T) => {
  return (envValue: string) => {
    try {
      const val = getEnv(envValue);
      return val.toLowerCase() === 'true' || val === '1';
    } catch (e: unknown) {
      if (e instanceof MissingConfigNameEnv) {
        log.err(
          `Missing environment variable ${envValue}. Throwing error: ${error}`,
        );
        throw error;
      }
      log.err(
        `Critical error occurred while getting environment variable ${envValue}: ${e}`,
      );
      throw new CriticalError((e as { message: string }).message);
    }
  };
};

/**
 * Возвращает строковое значение переменной окружения или вычисляет его асинхронно, если переменная отсутствует.
 * @param compute Функция для асинхронного вычисления значения.
 * @returns Асинхронная функция, возвращающая значение переменной окружения или вычисляющая его.
 */
const getStringOrAsyncCompute = (compute: () => Promise<string>) => {
  return async (envValue: string) => {
    try {
      return getEnv(envValue);
    } catch (e: unknown) {
      if (e instanceof MissingConfigNameEnv) {
        log.inf(
          `Environment variable ${envValue} is missing. Computing value asynchronously.`,
        );
        return await compute();
      }
      log.err(
        `Critical error occurred while getting environment variable ${envValue}: ${e}`,
      );
      throw new CriticalError((e as { message: string }).message);
    }
  };
};

/**
 * Возвращает числовое значение переменной окружения или вычисляет его асинхронно, если переменная отсутствует.
 * @param compute Функция для асинхронного вычисления значения.
 * @returns Асинхронная функция, возвращающая значение переменной окружения или вычисляющая его.
 */
const getNumberOrAsyncCompute = (compute: () => Promise<number>) => {
  return async (envValue: string) => {
    try {
      return Number(getEnv(envValue));
    } catch (e: unknown) {
      if (e instanceof MissingConfigNameEnv) {
        log.inf(
          `Environment variable ${envValue} is missing. Computing value asynchronously.`,
        );
        return await compute();
      }
      log.err(
        `Critical error occurred while getting environment variable ${envValue}: ${e}`,
      );
      throw new CriticalError((e as { message: string }).message);
    }
  };
};

/**
 * Возвращает булевое значение переменной окружения или вычисляет его асинхронно, если переменная отсутствует.
 * @param compute Функция для асинхронного вычисления значения.
 * @returns Асинхронная функция, возвращающая значение переменной окружения или вычисляющая его.
 */
const getBooleanOrAsyncCompute = (
  compute: () => Promise<boolean>,
) => {
  return async (envValue: string) => {
    try {
      const val = getEnv(envValue);
      return val.toLowerCase() === 'true' || val === '1';
    } catch (e: unknown) {
      if (e instanceof MissingConfigNameEnv) {
        log.inf(
          `Environment variable ${envValue} is missing. Computing value asynchronously.`,
        );
        return await compute();
      }
      log.err(
        `Critical error occurred while getting environment variable ${envValue}: ${e}`,
      );
      throw new CriticalError((e as { message: string }).message);
    }
  };
};

/**
 * Возвращает строковое значение переменной окружения или вычисляет его, если переменная отсутствует.
 * @param compute Функция для вычисления значения.
 * @returns Функция, возвращающая значение переменной окружения или вычисляющая его.
 */
const getStringOrCompute = (compute: () => string) => {
  return (envValue: string) => {
    try {
      return getEnv(envValue);
    } catch (e: unknown) {
      if (e instanceof MissingConfigNameEnv) {
        log.inf(
          `Environment variable ${envValue} is missing. Computing value.`,
        );
        return compute();
      }
      log.err(
        `Critical error occurred while getting environment variable ${envValue}: ${e}`,
      );
      throw new CriticalError((e as { message: string }).message);
    }
  };
};

/**
 * Возвращает числовое значение переменной окружения или вычисляет его, если переменная отсутствует.
 * @param compute Функция для вычисления значения.
 * @returns Функция, возвращающая значение переменной окружения или вычисляющая его.
 */
const getNumberOrCompute = (compute: () => number) => {
  return (envValue: string) => {
    try {
      return Number(getEnv(envValue));
    } catch (e: unknown) {
      if (e instanceof MissingConfigNameEnv) {
        log.inf(
          `Environment variable ${envValue} is missing. Computing value.`,
        );
        return compute();
      }
      log.err(
        `Critical error occurred while getting environment variable ${envValue}: ${e}`,
      );
      throw new CriticalError((e as { message: string }).message);
    }
  };
};

/**
 * Возвращает булевое значение переменной окружения или вычисляет его, если переменная отсутствует.
 * @param compute Функция для вычисления значения.
 * @returns Функция, возвращающая значение переменной окружения или вычисляющая его.
 */
const getBooleanOrCompute = (compute: () => boolean) => {
  return (envValue: string) => {
    try {
      const val = getEnv(envValue);
      return val.toLowerCase() === 'true' || val === '1';
    } catch (e: unknown) {
      if (e instanceof MissingConfigNameEnv) {
        log.inf(
          `Environment variable ${envValue} is missing. Computing value.`,
        );
        return compute();
      }
      log.err(
        `Critical error occurred while getting environment variable ${envValue}: ${e}`,
      );
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