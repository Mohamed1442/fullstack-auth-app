import { HttpStatus } from '@nestjs/common';
import { ExceptionResponse } from '../interfaces';

export const forbiddenProperties: ExceptionResponse = {
  statusCode: HttpStatus.FORBIDDEN,
  error: 'FORBIDDEN',
  message: 'You are not authorized to perform this action.',
};
