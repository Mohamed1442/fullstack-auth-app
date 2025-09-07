import { HttpStatus } from '@nestjs/common';
import { ExceptionResponse } from '../interfaces';

export const unauthorizedProperties: ExceptionResponse = {
  statusCode: HttpStatus.UNAUTHORIZED,
  error: 'UNAUTHORIZED',
  message: 'You are not authorized to access this resource.',
};
