import { UNIDENTIFIED_ERR_TEXT } from './variables';


export class LoginError extends Error {
  constructor(message) {
    super(message);
    this.name = 'LoginError';
  }
}


export class UnidentifiedApiError extends Error {
  constructor() {
    super(UNIDENTIFIED_ERR_TEXT);
    this.name = 'UnidentifiedApiError';
  }
}

export class EmptyError extends Error {
  constructor(message) {
    super(message);
    this.name = 'EmptyError';
  }
}

export class OverdraftError extends Error {
  constructor() {
    super('Недостаточно средств на счёте');
    this.name = 'OverdraftError';
  }
}

export class InvalidAccountError extends Error {
  constructor() {
    super('Несуществующий счёт');
    this.name = 'InvalidAccountError';
  }
}
