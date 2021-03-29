import { HttpModule, Module } from '@nestjs/common';
import { SharedModule } from './shared/shared.module';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import path from 'path';
import { ConfigModule } from '@nestjs/config';

const ENV = process.env.NODE_ENV;
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: path.resolve(
        process.cwd(),
        !ENV ? '.development.env' : `.${ENV}.env`,
      ),
      isGlobal: true,
    }),
    SharedModule,
    AuthModule,
    HttpModule,
    UserModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
