export class InvalidPeriodFormat extends Error {
  constructor() {
    super('Invalid period format');
  }
}

export class NonComparableItems extends Error {
  constructor(a: unknown, b: unknown) {
    super(`Cannot compare ${typeof a} and ${typeof b}`);
  }
}

export class NonCopyItems extends Error {
  constructor(a: unknown, b: unknown) {
    super(`Cannot copy ${typeof a} to ${typeof b}`);
  }
}
