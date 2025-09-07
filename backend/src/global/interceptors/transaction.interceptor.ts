import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Connection } from 'mongoose';
import { InjectConnection } from '@nestjs/mongoose';
import { Observable, catchError, concatMap, finalize } from 'rxjs';

@Injectable()
export class TransactionInterceptor implements NestInterceptor {
  private readonly logger = new Logger(TransactionInterceptor.name);

  constructor(@InjectConnection() private readonly connection: Connection) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const session = await this.connection.startSession();
    session.startTransaction();

    this.logger.log(`Transaction started for ${context.getClass().name}`);

    return next.handle().pipe(
      concatMap(async (data) => {
        await session.commitTransaction();
        this.logger.log(`Transaction committed for ${context.getClass().name}`);
        return data;
      }),
      catchError(async (err) => {
        await session.abortTransaction();
        this.logger.error(
          `Transaction rolled back for ${context.getClass().name}`,
        );
        throw err;
      }),
      finalize(async () => {
        await session.endSession();
        this.logger.log(`Transaction ended for ${context.getClass().name}`);
      }),
    );
  }
}
