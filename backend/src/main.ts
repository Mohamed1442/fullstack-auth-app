import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './global/filters';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);

  // enabling cookie parser
  app.use(cookieParser());

  // setting security HTTP headers
  app.use(helmet());

  // global exception filter(Handle all exceptions thrown in the application)
  app.useGlobalFilters(new GlobalExceptionFilter());

  // global validation pipe
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  // swagger docs configuration
  const SWAGGER_PRODUCTION_PREFIX = configService.getOrThrow<string>(
    'SWAGGER_PRODUCTION_PREFIX',
  );

  const config = new DocumentBuilder()
    .setTitle('Authentication Service')
    .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT' })
    .addServer('', 'Local Environment')
    .addServer(SWAGGER_PRODUCTION_PREFIX, 'Production Environment')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  // enabling CORS
  app.enableCors({
    origin: configService.getOrThrow<string>('FRONTEND_URL'),
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  // starting the server
  await app.listen(configService.getOrThrow<string>('PORT'));
}

bootstrap();
