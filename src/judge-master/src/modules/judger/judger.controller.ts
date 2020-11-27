import { JudgerService } from './judger.service';
import { Body, Controller, Get, Headers, HttpService, Ip, Param, ParseIntPipe, Post, Query, Req } from '@nestjs/common';
import { CodeBodyDto, CodeGameBodyDto } from './dto/code-body.dto';
import { SingleBodyDto, SingleGameBodyDto } from './dto/single-body.dto';
import { UserId } from 'src/decorators/user-id.decorator';
import { ProblemType } from 'src/db/entities/problem-type';
import { FillBodyDto, FillGameBodyDto } from './dto/fill-body.dto';
import { MultiBodyDto, MultiGameBodyDto } from './dto/multi-body.dto';
import { UseValidPipe } from 'src/decorators/use-valid-pipe.decorator';
import { UsePagePipe } from 'src/decorators/use-page-pipe.decorator';
import { PageQueryDto } from 'src/dto/page-query.dto';
import { PageQueryValidationPipe } from 'src/pipes/page-query-validation.pipe';
import { Errcode, UnifyException } from 'src/exceptions/unify.exception';

@Controller('judger')
export class JudgerController {

  constructor(
    private judgerService: JudgerService,
    private httpService: HttpService
  ) { }


  @Post('single')
  @UseValidPipe()
  async judgeSingle (@Body() body: SingleBodyDto, @UserId() userId: number, @Ip() ip: string) {
    return await this.judgerService.judge(ProblemType.SINGLE, body, userId, ip);
  }


  @Post('multi')
  @UseValidPipe()
  async judgeMulti (@Body() body: MultiBodyDto, @UserId() userId: number, @Ip() ip: string) {
    return await this.judgerService.judge(ProblemType.MULTI, body, userId, ip);
  }


  @Post('fill')
  @UseValidPipe()
  async judgeFill (@Body() body: FillBodyDto, @UserId() userId: number, @Ip() ip: string) {
    return await this.judgerService.judge(ProblemType.FILL, body, userId, ip);
  }


  @Post('code')
  @UseValidPipe()
  async judgeCode (@Body() body: CodeBodyDto, @UserId() userId: number, @Ip() ip: string) {
    return await this.judgerService.judge(ProblemType.CODE, body, userId, ip);
  }


  @Post('game/single')
  @UseValidPipe()
  async judgeGameSingle (@Body() body: SingleGameBodyDto, @UserId() userId: number, @Ip() ip: string) {
    return await this.judgerService.gameJudge(ProblemType.SINGLE, body, userId, ip);
  }


  @Post('game/multi')
  @UseValidPipe()
  async judgeGameMulti (@Body() body: MultiGameBodyDto, @UserId() userId: number, @Ip() ip: string) {
    return await this.judgerService.gameJudge(ProblemType.MULTI, body, userId, ip);
  }


  @Post('game/fill')
  @UseValidPipe()
  async judgeGameFill (@Body() body: FillGameBodyDto, @UserId() userId: number, @Ip() ip: string) {
    return await this.judgerService.gameJudge(ProblemType.FILL, body, userId, ip);
  }


  @Post('game/code')
  @UseValidPipe()
  async judgeGameCode (@Body() body: CodeGameBodyDto, @UserId() userId: number, @Ip() ip: string) {
    return await this.judgerService.gameJudge(ProblemType.CODE, body, userId, ip);
  }

  @Get('solution')
  @UsePagePipe()
  async getSolutions (@Query() pageDto: PageQueryDto) {
    return PageQueryValidationPipe.queryRepo(this.judgerService.repo, pageDto);
  }

  @Get('solution/:solutionId')
  getSolution (@Param('solutionId', ParseIntPipe) solutionId: number) {
    return this.judgerService.repo.findOne(solutionId);
  }

  @Get('/')
  async getJudgerCoder () {
    const [err, data] = await this.judgerService.judgeCoder.ping();
    if (err) {
      throw new UnifyException("判题机错误", Errcode.JUDGER_SERVER_ERR);
    }
    return data;
  }

  @Get('job')
  @UsePagePipe()
  getJobs (@Query() pageDto: PageQueryDto) {
    return this.judgerService.getJobs(pageDto);
  }


  @Get('job/:jobId')
  getJob (@Param('jobId', ParseIntPipe) jobId) {
    return this.judgerService.queue.getJob(jobId);
  }
}
