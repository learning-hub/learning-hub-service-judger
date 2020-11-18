import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query } from '@nestjs/common';
import { UsePutValidPipe } from 'src/decorators/use-put-valid-pipe.decorator';
import { UseValidPipe } from 'src/decorators/use-valid-pipe.decorator';
import { UserId } from 'src/decorators/user-id.decorator';
import { PageQueryDto } from './dto/page-query.dto';
import { ProblemCodeBodyDto } from './dto/problem-code-body.dto';
import { ProblemFillBodyDto } from './dto/problem-fill-body.dto';
import { ProblemMultiBodyDto } from './dto/problem-multi-body.dto';
import { ProblemSingleBodyDto } from './dto/problem-single-body.dto';
import { ProblemService } from './problem.service';
import { UsePagePipe } from 'src/decorators/use-page-pipe.decorator';

@Controller('problem')
export class ProblemController {

  constructor(
    private problemService: ProblemService
  ) { }

  @Get('/')
  @UsePagePipe(['id', 'title', 'type'])
  getProblemAll (@Query() pageDto: PageQueryDto) {
    return this.problemService.finds(pageDto);
  }

  @Get('/:problemId')
  getProblem (@Param('problemId', ParseIntPipe) problemId: number) {
    return this.problemService.repository.findOne(problemId);
  }

  @Delete('/:problemId')
  async deleteProblem (@Param('problemId', ParseIntPipe) problemId: number) {
    const problem = await this.problemService.repository.findOne(problemId);
    await this.problemService.repository.delete(problemId);
    return problem;
  }

  @Put('/single/:problemId')
  @UsePutValidPipe()
  async updateSingleProblem (@Param('problemId', ParseIntPipe) problemId: number, @Body() updateProblem: ProblemSingleBodyDto) {
    const problem = await this.problemService.repository.findOne(problemId);
    this.problemService.updateProblem(problem, updateProblem);
    return await this.problemService.repository.save(problem);
  }

  @Put('/multi/:problemId')
  @UsePutValidPipe()
  async updateMultiProblem (@Param('problemId', ParseIntPipe) problemId: number, @Body() updateProblem: ProblemMultiBodyDto) {
    const problem = await this.problemService.repository.findOne(problemId);
    this.problemService.updateProblem(problem, updateProblem);
    return await this.problemService.repository.save(problem);
  }

  @Put('/fill/:problemId')
  @UsePutValidPipe()
  async updateFillProblem (@Param('problemId', ParseIntPipe) problemId: number, @Body() updateProblem: ProblemFillBodyDto) {
    const problem = await this.problemService.repository.findOne(problemId);
    this.problemService.updateProblem(problem, updateProblem);
    return await this.problemService.repository.save(problem);
  }

  @Put('/code/:problemId')
  @UsePutValidPipe()
  async updateCodeProblem (@Param('problemId', ParseIntPipe) problemId: number, @Body() updateProblem: ProblemCodeBodyDto) {
    const problem = await this.problemService.repository.findOne(problemId);
    this.problemService.updateProblem(problem, updateProblem);
    return await this.problemService.repository.save(problem);
  }

  @Post('/single')
  @UseValidPipe()
  async createSingleProblem (@Body() singleProblem: ProblemSingleBodyDto, @UserId() userId: number) {
    const problem = this.problemService.createProblem<ProblemSingleBodyDto>(singleProblem);
    problem.create_user_id = userId;
    return await this.problemService.repository.save(problem);
  }


  @Post('/multi')
  @UseValidPipe()
  async createMultiProblem (@Body() multiProblem: ProblemMultiBodyDto, @UserId() userId: number) {
    const problem = this.problemService.createProblem(multiProblem);
    problem.create_user_id = userId;
    return await this.problemService.repository.save(problem);
  }

  @Post('/fill')
  @UseValidPipe()
  async createFillProblem (@Body() fillProblem: ProblemFillBodyDto, @UserId() userId: number) {
    const problem = this.problemService.createProblem(fillProblem);
    problem.create_user_id = userId;
    return await this.problemService.repository.save(problem);
  }

  @Post('/code')
  @UseValidPipe()
  async createCodeProblem (@Body() codeProblem: ProblemCodeBodyDto, @UserId() userId: number) {
    const problem = this.problemService.createProblem(codeProblem);
    problem.create_user_id = userId;
    return await this.problemService.repository.save(problem);
  }
}
