import { HttpException } from '@nestjs/common';

export enum Code {
  EXPIRED_TOKEN = 'CLQ002',
  INVALID_TOKEN = 'CLQ001',
}

export const detail: Record<Code, any> = {
  [Code.EXPIRED_TOKEN]: {
    status: 412,
    message: 'Token JWT is expired',
  },
  [Code.INVALID_TOKEN]: {
    status: 412,
    message: 'JWT token is invalid or expired',
  },
};

export class ValidationException extends HttpException {
  constructor(code: Code) {
    super(
      {
        code: code,
        message: detail[code].message,
      },
      detail[code].status,
    );
  }
}
