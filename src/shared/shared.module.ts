import { Global, HttpModule, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MongooseConfigService } from './config/mongo.config';
import { JwtConfigService } from './config/jwt.config';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { KafkaModule } from "@kimtuan1102/nestjs-kafka";
import { KafkaConfigService } from "./config/kafka.config";
import { KAFKA_CONNECTION_NAME } from "../common/constants/kafka";
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
    KafkaModule.registerAsync([KAFKA_CONNECTION_NAME], {
      imports: [ConfigModule],
      useClass: KafkaConfigService,
    }),
  ],
  exports: [HttpModule, JwtModule],
})
export class SharedModule {}
