import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { unauthorizedProperties } from '../constants';

export const ApiSingleUnauthorized = () => {
  return applyDecorators(
    ApiResponse({
      status: HttpStatus.UNAUTHORIZED,
      description: unauthorizedProperties.message as string,
      schema: {
        type: 'object',
        properties: {
          statusCode: {
            type: 'number',
            example: unauthorizedProperties.statusCode,
          },
          error: { type: 'string', example: unauthorizedProperties.error },
          message: {
            type: 'string',
            items: { type: 'string' },
            example: unauthorizedProperties.message,
          },
        },
      },
    }),
  );
};
