import { BadRequestException, Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query } from '@nestjs/common';
import { UsePutValidPipe } from 'src/decorators/use-put-valid-pipe.decorator';
import { UseValidPipe } from 'src/decorators/use-valid-pipe.decorator';
import { UserId } from 'src/decorators/user-id.decorator';
import { PageQueryDto } from '../../dto/page-query.dto';
import { ProblemCodeBodyDto } from './dto/problem-code-body.dto';
import { ProblemFillBodyDto } from './dto/problem-fill-body.dto';
import { ProblemMultiBodyDto } from './dto/problem-multi-body.dto';
import { ProblemSingleBodyDto } from './dto/problem-single-body.dto';
import { ProblemService } from './problem.service';
import { UsePagePipe } from 'src/decorators/use-page-pipe.decorator';
import { CreateTestCaseDto } from './dto/create-test-case.dto';
import { PageQueryValidationPipe } from 'src/pipes/page-query-validation.pipe';
import { delProps } from 'src/tools/data.tools';

@Controller('problem')
export class ProblemController {

  constructor(
    private problemService: ProblemService
  ) { }

  @Get('/')
  @UsePagePipe(['id', 'title', 'type'])
  async getProblemAll (@Query() pageDto: PageQueryDto) {
    const res = await PageQueryValidationPipe.queryRepo(this.problemService.repo, pageDto);
    res.list.map(item => delProps(item.data, ['src', 'answer', 'answers', 'nokeywords', 'keywords']));
    return res;
  }

  @Get('/:problemId')
  getProblem (@Param('problemId', ParseIntPipe) problemId: number) {
    return this.problemService.repo.findOne(problemId);
  }

  @Delete('/:problemId')
  async deleteProblem (@Param('problemId', ParseIntPipe) problemId: number) {
    const problem = await this.problemService.repo.findOne(problemId);
    if (!problem) {
      throw new BadRequestException("没有找到题");
    }
    await this.problemService.repo.delete(problemId);
    await this.problemService.removeTestCase(problemId);
    return problem;
  }

  @Put('/single/:problemId')
  @UsePutValidPipe()
  async updateSingleProblem (@Param('problemId', ParseIntPipe) problemId: number, @Body() updateProblem: ProblemSingleBodyDto) {
    const problem = await this.problemService.repo.findOne(problemId);
    this.problemService.updateProblem(problem, updateProblem);
    return await this.problemService.repo.save(problem);
  }

  @Put('/multi/:problemId')
  @UsePutValidPipe()
  async updateMultiProblem (@Param('problemId', ParseIntPipe) problemId: number, @Body() updateProblem: ProblemMultiBodyDto) {
    const problem = await this.problemService.repo.findOne(problemId);
    this.problemService.updateProblem(problem, updateProblem);
    return await this.problemService.repo.save(problem);
  }

  @Put('/fill/:problemId')
  @UsePutValidPipe()
  async updateFillProblem (@Param('problemId', ParseIntPipe) problemId: number, @Body() updateProblem: ProblemFillBodyDto) {
    const problem = await this.problemService.repo.findOne(problemId);
    this.problemService.updateProblem(problem, updateProblem);
    return await this.problemService.repo.save(problem);
  }

  @Put('/code/:problemId')
  @UsePutValidPipe()
  async updateCodeProblem (@Param('problemId', ParseIntPipe) problemId: number, @Body() updateProblem: ProblemCodeBodyDto) {
    const problem = await this.problemService.repo.findOne(problemId);
    this.problemService.updateProblem(problem, updateProblem);
    return await this.problemService.repo.save(problem);
  }

  @Post('/testCase/:problemId')
  @UseValidPipe()
  async createCodeProblemTestCase (@Param('problemId', ParseIntPipe) problemId: number, @Body() testCase: CreateTestCaseDto) {
    return this.problemService.createTestCase(problemId, testCase.input, testCase.output)
  }

  @Get('/testCase/:problemId')
  async getCodeProblemTestCase (@Param('problemId', ParseIntPipe) problemId: number) {
    return this.problemService.findTestCase(problemId);
  }

  @Delete('/testCase/:problemId')
  async removeCodeProblemTestCase (@Param('problemId', ParseIntPipe) problemId: number) {
    const testcase = await this.problemService.findTestCase(problemId);
    await this.problemService.removeTestCase(problemId);
    return testcase;
  }

  @Post('/single')
  @UseValidPipe()
  async createSingleProblem (@Body() singleProblem: ProblemSingleBodyDto, @UserId() userId: number) {
    const problem = await this.problemService.createProblem<ProblemSingleBodyDto>(singleProblem);
    problem.create_user_id = userId;
    return await this.problemService.repo.save(problem);
  }


  @Post('/multi')
  @UseValidPipe()
  async createMultiProblem (@Body() multiProblem: ProblemMultiBodyDto, @UserId() userId: number) {
    const problem = await this.problemService.createProblem(multiProblem);
    problem.create_user_id = userId;
    return await this.problemService.repo.save(problem);
  }

  @Post('/fill')
  @UseValidPipe()
  async createFillProblem (@Body() fillProblem: ProblemFillBodyDto, @UserId() userId: number) {
    const problem = await this.problemService.createProblem(fillProblem);
    problem.create_user_id = userId;
    return await this.problemService.repo.save(problem);
  }

  @Post('/code')
  @UseValidPipe()
  async createCodeProblem (@Body() codeProblem: ProblemCodeBodyDto, @UserId() userId: number) {
    const problem = await this.problemService.createProblem(codeProblem);
    problem.create_user_id = userId;
    const resProblem = await this.problemService.repo.save(problem);
    await this.problemService.createTestCase(resProblem.id, codeProblem.sample_input, codeProblem.sample_output);
    return problem;
  }
}
