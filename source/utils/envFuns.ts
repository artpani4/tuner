import luminous from 'jsr:@vseplet/luminous@1.0.6';

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
const getStringOrDefault = (
  value: string,
): (envValue: string) => string => {
  return (envValue: string): string => {
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
const getNumberOrDefault = (
  value: number,
): (envValue: string) => number => {
  return (envValue: string): number => {
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
const getBooleanOrDefault = (
  value: boolean,
): (envValue: string) => boolean => {
  return (envValue: string): boolean => {
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
const getStringOrExit = (
  exitMessage?: string,
): (envValue: string) => string => {
  return (envValue: string): string => {
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
const getNumberOrExit = (
  exitMessage?: string,
): (envValue: string) => number => {
  return (envValue: string): number => {
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
const getBooleanOrExit = (
  exitMessage?: string,
): (envValue: string) => boolean => {
  return (envValue: string): boolean => {
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
const getStringOrThrow = <T extends Error>(
  error: T,
): (envValue: string) => string => {
  return (envValue: string): string => {
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
const getNumberOrThrow = <T extends Error>(
  error: T,
): (envValue: string) => number => {
  return (envValue: string): number => {
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
const getBooleanOrThrow = <T extends Error>(
  error: T,
): (envValue: string) => boolean => {
  return (envValue: string): boolean => {
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
const getStringOrAsyncCompute = (
  compute: () => Promise<string>,
): (envValue: string) => Promise<string> => {
  return async (envValue: string): Promise<string> => {
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
const getNumberOrAsyncCompute = (
  compute: () => Promise<number>,
): (envValue: string) => Promise<number> => {
  return async (envValue: string): Promise<number> => {
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
): (envValue: string) => Promise<boolean> => {
  return async (envValue: string): Promise<boolean> => {
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
const getStringOrCompute = (
  compute: () => string,
): (envValue: string) => string => {
  return (envValue: string): string => {
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
const getNumberOrCompute = (
  compute: () => number,
): (envValue: string) => number => {
  return (envValue: string): number => {
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
const getBooleanOrCompute = (
  compute: () => boolean,
): (envValue: string) => boolean => {
  return (envValue: string): boolean => {
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
/**
 * Набор функций для получения переменных окружения различных типов.
 * @module EnvFuns
 */

/**
 * Возвращает функции для работы с числовыми переменными окружения.
 * @namespace
 */
const getNumber = {
  /**
   * Возвращает числовое значение переменной окружения или значение по умолчанию, если переменная отсутствует.
   * @function
   * @param {number} value - Значение по умолчанию.
   * @returns {function(string): number} Функция, возвращающая значение переменной окружения или значение по умолчанию.
   */
  orDefault: getNumberOrDefault,

  /**
   * Возвращает числовое значение переменной окружения или завершает процесс, если переменная отсутствует.
   * @function
   * @param {string} [exitMessage] - Сообщение перед завершением процесса.
   * @returns {function(string): number} Функция, возвращающая значение переменной окружения или завершающая процесс.
   */
  orExit: getNumberOrExit,

  /**
   * Возвращает числовое значение переменной окружения или вычисляет его асинхронно, если переменная отсутствует.
   * @function
   * @param {function(): Promise<number>} compute - Функция для асинхронного вычисления значения.
   * @returns {function(string): Promise<number>} Асинхронная функция, возвращающая значение переменной окружения или вычисляющая его.
   */
  orAsyncCompute: getNumberOrAsyncCompute,

  /**
   * Возвращает числовое значение переменной окружения или вычисляет его, если переменная отсутствует.
   * @function
   * @param {function(): number} compute - Функция для вычисления значения.
   * @returns {function(string): number} Функция, возвращающая значение переменной окружения или вычисляющая его.
   */
  orCompute: getNumberOrCompute,

  /**
   * Возвращает числовое значение переменной окружения или генерирует исключение, если переменная отсутствует.
   * @function
   * @param {Error} error - Исключение, которое нужно сгенерировать.
   * @returns {function(string): number} Функция, возвращающая значение переменной окружения или генерирующая исключение.
   */
  orThrow: getNumberOrThrow,

  /**
   * Возвращает числовое значение переменной окружения или undefined, если переменная отсутствует.
   * @function
   * @returns {function(): number | undefined} Функция, возвращающая значение переменной окружения или undefined.
   */
  orNothing: (): () => number | undefined => {
    return (): number | undefined => undefined;
  },
};

/**
 * Возвращает функции для работы со строковыми переменными окружения.
 * @namespace
 */
const getString = {
  /**
   * Возвращает строковое значение переменной окружения или значение по умолчанию, если переменная отсутствует.
   * @function
   * @param {string} value - Значение по умолчанию.
   * @returns {function(string): string} Функция, возвращающая значение переменной окружения или значение по умолчанию.
   */
  orDefault: getStringOrDefault,

  /**
   * Возвращает строковое значение переменной окружения или завершает процесс, если переменная отсутствует.
   * @function
   * @param {string} [exitMessage] - Сообщение перед завершением процесса.
   * @returns {function(string): string} Функция, возвращающая значение переменной окружения или завершающая процесс.
   */
  orExit: getStringOrExit,

  /**
   * Возвращает строковое значение переменной окружения или вычисляет его асинхронно, если переменная отсутствует.
   * @function
   * @param {function(): Promise<string>} compute - Функция для асинхронного вычисления значения.
   * @returns {function(string): Promise<string>} Асинхронная функция, возвращающая значение переменной окружения или вычисляющая его.
   */
  orAsyncCompute: getStringOrAsyncCompute,

  /**
   * Возвращает строковое значение переменной окружения или вычисляет его, если переменная отсутствует.
   * @function
   * @param {function(): string} compute - Функция для вычисления значения.
   * @returns {function(string): string} Функция, возвращающая значение переменной окружения или вычисляющая его.
   */
  orCompute: getStringOrCompute,

  /**
   * Возвращает строковое значение переменной окружения или генерирует исключение, если переменная отсутствует.
   * @function
   * @param {Error} error - Исключение, которое нужно сгенерировать.
   * @returns {function(string): string} Функция, возвращающая значение переменной окружения или генерирующая исключение.
   */
  orThrow: getStringOrThrow,

  /**
   * Возвращает строковое значение переменной окружения или undefined, если переменная отсутствует.
   * @function
   * @returns {function(): string | undefined} Функция, возвращающая значение переменной окружения или undefined.
   */
  orNothing: (): () => string | undefined => {
    return (): string | undefined => undefined;
  },
};

/**
 * Возвращает функции для работы с булевыми переменными окружения.
 * @namespace
 */
const getBoolean = {
  /**
   * Возвращает булевое значение переменной окружения или значение по умолчанию, если переменная отсутствует.
   * @function
   * @param {boolean} value - Значение по умолчанию.
   * @returns {function(string): boolean} Функция, возвращающая значение переменной окружения или значение по умолчанию.
   */
  orDefault: getBooleanOrDefault,

  /**
   * Возвращает булевое значение переменной окружения или завершает процесс, если переменная отсутствует.
   * @function
   * @param {string} [exitMessage] - Сообщение перед завершением процесса.
   * @returns {function(string): boolean} Функция, возвращающая значение переменной окружения или завершающая процесс.
   */
  orExit: getBooleanOrExit,

  /**
   * Возвращает булевое значение переменной окружения или вычисляет его асинхронно, если переменная отсутствует.
   * @function
   * @param {function(): Promise<boolean>} compute - Функция для асинхронного вычисления значения.
   * @returns {function(string): Promise<boolean>} Асинхронная функция, возвращающая значение переменной окружения или вычисляющая его.
   */
  orAsyncCompute: getBooleanOrAsyncCompute,

  /**
   * Возвращает булевое значение переменной окружения или вычисляет его, если переменная отсутствует.
   * @function
   * @param {function(): boolean} compute - Функция для вычисления значения.
   * @returns {function(string): boolean} Функция, возвращающая значение переменной окружения или вычисляющая его.
   */
  orCompute: getBooleanOrCompute,

  /**
   * Возвращает булевое значение переменной окружения или генерирует исключение, если переменная отсутствует.
   * @function
   * @param {Error} error - Исключение, которое нужно сгенерировать.
   * @returns {function(string): boolean} Функция, возвращающая значение переменной окружения или генерирующая исключение.
   */
  orThrow: getBooleanOrThrow,

  /**
   * Возвращает логическое значение переменной окружения или undefined, если переменная отсутствует.
   * @function
   * @returns {function(): boolean | undefined} Функция, возвращающая значение переменной окружения или undefined.
   */
  orNothing: (): () => boolean | undefined => {
    return (): boolean | undefined => undefined;
  },
};

/**
 * Экспортирует функции для работы с переменными окружения.
 */
export default { getString, getNumber, getBoolean };
