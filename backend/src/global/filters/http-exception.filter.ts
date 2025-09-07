import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { IncomingMessage } from 'http';
import { ExceptionResponse } from '../interfaces';
import { ThrottlerException } from '@nestjs/throttler';

const getStatusCode = <T>(exception: T): number => {
  return exception instanceof HttpException
    ? exception.getStatus()
    : HttpStatus.INTERNAL_SERVER_ERROR;
};

const getErrorMessage = <T>(exception: T): string | string[] => {
  if (exception instanceof HttpException) {
    if (exception instanceof ThrottlerException) {
      return ['Too Many Requests. Please try again after 1 minute.'];
    }

    const response = exception.getResponse() as ExceptionResponse | string;

    if (typeof response === 'string') {
      return [response];
    }

    if (typeof response === 'object' && response?.message) {
      return Array.isArray(response.message)
        ? response.message.filter(Boolean)
        : [response.message];
    }

    return ['An unexpected HTTP error occurred'];
  }

  return ['An error occurred'];
};

@Catch()
export class GlobalExceptionFilter<T> implements ExceptionFilter {
  catch(exception: T, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<IncomingMessage>();
    const statusCode = getStatusCode<T>(exception);
    const message = getErrorMessage<T>(exception);

    response.status(statusCode).json({
      error: {
        statusCode,
        timestamp: new Date().toISOString(),
        path: request.url,
        message: Array.isArray(message) ? message : [message],
      },
    });
  }
}
