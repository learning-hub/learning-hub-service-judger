import { JudgerService } from './judger.service';
import { Body, Controller, Headers, Ip, Param, Post, Query, Req } from '@nestjs/common';
import { CodeBodyDto } from './dto/code-body.dto';
import { SingleBodyDto } from './dto/single-body.dto';
import { UserId } from 'src/decorators/user-id.decorator';
import { ProblemType } from 'src/db/entities/problem-type';
import { FillBodyDto } from './dto/fill-body.dto';
import { MultiBodyDto } from './dto/multi-body.dto';

@Controller('judger')
export class JudgerController {

  constructor(private judgerService: JudgerService) { }

  @Post('single')
  async judgeSingle (@Body() body: SingleBodyDto, @UserId() userId: number, @Ip() ip: string) {
    return await this.judgerService.judge(ProblemType.SINGLE, body, userId, ip);
  }


  @Post('multi')
  async judgeMulti (@Body() body: MultiBodyDto, @UserId() userId: number, @Ip() ip: string) {
    return await this.judgerService.judge(ProblemType.MULTI, body, userId, ip);
  }


  @Post('fill')
  async judgeFill (@Body() body: FillBodyDto, @UserId() userId: number, @Ip() ip: string) {
    return await this.judgerService.judge(ProblemType.FILL, body, userId, ip);
  }


  @Post('code')
  async judgeCode (@Body() body: CodeBodyDto, @UserId() userId: number, @Ip() ip: string) {
    return await this.judgerService.judge(ProblemType.CODE, body, userId, ip);
  }
}
