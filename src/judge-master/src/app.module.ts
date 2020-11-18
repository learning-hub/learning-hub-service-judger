import { Module } from '@nestjs/common';
import { JudgerModule } from 'src/modules/judger/judger.module';
import { DbModule } from './db/db.module';
import { AppController } from './app.controller';
import { ProblemModule } from './modules/problem/problem.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', '.env.development']
    }),
    JudgerModule,
    DbModule,
    ProblemModule
  ],
  controllers: [AppController],
})
export class AppModule { }
