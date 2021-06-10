import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { KAFKA_CONNECTION_NAME } from '../../common/constants/kafka';
import {
  KafkaModuleOption,
  KafkaOptionsFactory,
} from '@fpt-smart-cloud/nestjs-kafka';

@Injectable()
export class KafkaConfigService implements KafkaOptionsFactory {
  constructor(private configService: ConfigService) {}
  createKafkaModuleOptions(): KafkaModuleOption[] {
    let brokers = this.configService.get('KAFKA_BROKERS');
    const clientId = this.configService.get('KAFKA_CLIENT_ID');
    if (!brokers) {
      throw new NotFoundException('KAFKA_BROKERS env is missing');
    }
    if (!clientId) {
      throw new NotFoundException('KAFKA_CLIENT_ID env is missing');
    }
    brokers = brokers.split(',');
    return [
      {
        name: KAFKA_CONNECTION_NAME,
        options: {
          client: {
            clientId: clientId,
            brokers: brokers,
          },
          consumer: {
            groupId: clientId,
          },
        },
      },
    ];
  }
}
