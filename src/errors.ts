export class MissingConfigNameEnv extends Error {
  constructor(name: string) {
    super(`Missing ${name} env variable`);
  }
}

export class CriticalError extends Error {
  constructor(message: string) {
    super(message);
  }
}
