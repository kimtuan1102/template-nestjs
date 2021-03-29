import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import RateLimit from 'express-rate-limit';
import compression from 'compression';
import morgan from 'morgan';
import helmet from 'helmet';

import {
  ExpressAdapter,
  NestExpressApplication,
} from '@nestjs/platform-express';
import {
  ClassSerializerInterceptor,
  HttpStatus,
  UnprocessableEntityException,
  ValidationPipe,
} from '@nestjs/common';
import { setupSwagger } from './setup.swagger';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(
    AppModule,
    new ExpressAdapter(),
    { cors: true },
  );
  app.enable('trust proxy'); // Chỉ sử dụng khi ứng dụng đứng sau proxy (nginx, ha proxy, etc )
  app.use(helmet()); // Tránh các vấn đề bảo mật đã biết bằng cách thiết lập http header
  app.use(
    RateLimit({
      windowMs: 15 * 60 * 1000, // 15 phút
      max: 100, // Giới hạn mỗi IP 100 request trên 1 khoảng windowMs
    }),
  );
  app.use(compression()); // Nén toàn bộ response của ứng dụng
  app.use(morgan('combined')); // Log truy cập ứng dụng
  const reflector = app.get(Reflector);
  app.useGlobalInterceptors(new ClassSerializerInterceptor(reflector)); // Sử dụng serializer cho toàn bộ ứng dụng
  // Validate toàn bộ request tới ứng dụng
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      transform: true,
      dismissDefaultMessages: true,
      exceptionFactory: (errors) => new UnprocessableEntityException(errors),
    }),
  );
  const configService = app.get(ConfigService);
  // Chỉ mở swagger trên môi trường dev và staging
  if (
    ['development', 'staging'].includes(
      configService.get('NODE_ENV') || 'development',
    )
  ) {
    setupSwagger(app);
  }
  const port = Number(configService.get('PORT'));
  await app.listen(port);
}
bootstrap();
