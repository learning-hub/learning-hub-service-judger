import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm/dist/typeorm.module';
import { DbService } from './db.service';
import { Problem } from './entities/problem';
import { Solution } from './entities/solution';

@Module({
  imports: [TypeOrmModule.forRoot(), TypeOrmModule.forFeature([Problem, Solution])],
  providers: [DbService],
  exports: [DbService]
})
export class DbModule { }
