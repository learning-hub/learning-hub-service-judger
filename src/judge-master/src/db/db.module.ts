import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm/dist/typeorm.module';
import { DbService } from './db.service';
import { Problem } from './entities/problem';
import { Solution } from './entities/solution';

@Module({
  imports: [TypeOrmModule.forRootAsync({
    inject: [ConfigService],
    useFactory (configService: ConfigService) {
      return {
        type: 'mysql',
        host: configService.get<string>('MYSQL_HOST'),
        port: Number(configService.get<string>('MYSQL_PORT')),
        username: configService.get<string>('MYSQL_USER'),
        password: configService.get<string>('MYSQL_PASS'),
        database: configService.get<string>('MYSQL_DB'),
        entities: [Problem, Solution],
        synchronize: configService.get<string>('MYSQL_SYNC') === 'true',
      }
    }
  }), TypeOrmModule.forFeature([Problem, Solution])],
  providers: [DbService],
  exports: [DbService]
})
export class DbModule { }
