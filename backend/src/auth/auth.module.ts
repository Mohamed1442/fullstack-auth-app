import { Module } from '@nestjs/common';
import { AuthController } from './controllers';
import { AuthService } from './services';
import { MongooseModule } from '@nestjs/mongoose';
import { RefreshToken, RefreshTokenSchema } from './schemas';
import { AccessTokenStrategy } from './strategies';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UsersModule } from 'src/users/users.module';
import { RefreshTokenRepository } from './repositories';

@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => ({
        signOptions: {
          expiresIn: configService.getOrThrow(
            'JWT_ACCESS_TOKEN_EXPIRE_TIME_STRING',
          ),
        },
        secret: configService.getOrThrow('JWT_ACCESS_TOKEN_SECRET'),
      }),
      inject: [ConfigService],
    }),
    MongooseModule.forFeature([
      { name: RefreshToken.name, schema: RefreshTokenSchema },
    ]),
    UsersModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, RefreshTokenRepository, AccessTokenStrategy],
})
export class AuthModule {}
