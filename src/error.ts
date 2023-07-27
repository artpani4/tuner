export class missingConfigNameEnv extends Error {
  constructor(name: string) {
    super(`Missing ${name} env variable`);
  }
}

export class criticalError extends Error {
  constructor(message: string) {
    super(message);
  }
}
