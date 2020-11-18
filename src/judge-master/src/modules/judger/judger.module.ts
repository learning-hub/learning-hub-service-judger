import { JudgerConsumer } from './judger.consumer';
import { BullModule } from '@nestjs/bull';
import { HttpModule, Module } from '@nestjs/common';
import { JudgerService } from './judger.service';
import { JudgerController } from './judger.controller';
import { ProblemModule } from '../problem/problem.module';
import { ConfigService } from '@nestjs/config';
import { DbModule } from 'src/db/db.module';

@Module({
  imports: [BullModule.registerQueueAsync({
    name: 'judger',
    inject: [ConfigService],
    useFactory (configService: ConfigService) {
      return {
        redis: {
          host: configService.get<string>('REDIS_HOST'),
          port: Number(configService.get<number>('REDIS_PORT'))
        }
      }
    }
  }), HttpModule, ProblemModule, DbModule],
  providers: [JudgerService, JudgerConsumer],
  controllers: [JudgerController]
})
export class JudgerModule { }
