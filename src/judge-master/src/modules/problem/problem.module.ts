import { Module } from '@nestjs/common';
import { DbModule } from 'src/db/db.module';
import { ProblemController } from './problem.controller';
import { ProblemService } from './problem.service';

@Module({
  imports: [DbModule],
  controllers: [ProblemController],
  providers: [ProblemService],
  exports: [ProblemService]
})
export class ProblemModule { }
