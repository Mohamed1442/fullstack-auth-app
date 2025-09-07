import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { forbiddenProperties } from '../constants';

export const ApiSingleForbidden = () => {
  return applyDecorators(
    ApiResponse({
      status: HttpStatus.FORBIDDEN,
      description: forbiddenProperties.message as string,
      schema: {
        type: 'object',
        properties: {
          statusCode: {
            type: 'number',
            example: forbiddenProperties.statusCode,
          },
          error: { type: 'string', example: forbiddenProperties.error },
          message: { type: 'string', example: forbiddenProperties.message },
        },
      },
    }),
  );
};
