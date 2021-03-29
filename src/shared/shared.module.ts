import { Global, HttpModule, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MongooseConfigService } from './config/mongo.config';
import { JwtConfigService } from './config/jwt.config';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
@Global()
@Module({
  imports: [
    HttpModule,
    MongooseModule.forRootAsync({
      useClass: MongooseConfigService,
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useClass: JwtConfigService,
    }),
  ],
  exports: [HttpModule, JwtModule],
})
export class SharedModule {}
