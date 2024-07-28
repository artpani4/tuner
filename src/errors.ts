/**
 * Класс ошибки, который выбрасывается, если отсутствует необходимая переменная окружения.
 */
export class MissingConfigNameEnv extends Error {
  /**
   * Создает экземпляр ошибки MissingConfigNameEnv.
   * @param name Имя отсутствующей переменной окружения.
   */
  constructor(name: string) {
    super(`Missing ${name} env variable`);
  }
}

/**
 * Класс ошибки, который выбрасывается в критических ситуациях.
 */
export class CriticalError extends Error {
  /**
   * Создает экземпляр ошибки CriticalError.
   * @param message Сообщение ошибки.
   */
  constructor(message: string) {
    super(message);
  }
}
