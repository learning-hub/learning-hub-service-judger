import { Solution } from './../../db/entities/solution';
import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';
import { ProblemType } from 'src/db/entities/problem-type';
import { ProblemService } from '../problem/problem.service';
import { DbService } from 'src/db/db.service';
import { SolutionCode, SolutionFill, SolutionMulti, SolutionSingle } from 'src/db/entities/solution-type';
import { Problem } from 'src/db/entities/problem';
import { SingleBodyDto } from './dto/single-body.dto';
import { MultiBodyDto } from './dto/multi-body.dto';
import { FillBodyDto } from './dto/fill-body.dto';
import { CodeBodyDto } from './dto/code-body.dto';
import { PageQueryDto } from 'src/dto/page-query.dto';
import { Errcode, UnifyException } from 'src/exceptions/unify.exception';
import { JudgeCoderTools } from 'src/tools/judge-coder.tools';
import { ConfigService } from '@nestjs/config';
import { PageQueryValidationPipe } from 'src/pipes/page-query-validation.pipe';

@Injectable()
export class JudgerService {
  private judgeCoderTools: JudgeCoderTools;

  constructor(
    @InjectQueue('judger') private judgerQueue: Queue,
    private db: DbService,
    private configService: ConfigService
  ) {
    this.judgeCoderTools = new JudgeCoderTools(this.configService.get<string>('JUDGE_CODER_SERVER'), this.configService.get<string>('JUDGE_CODER_TOKEN'));
  }

  get repo () {
    return this.db.solution;
  }

  get queue () {
    return this.judgerQueue;
  }

  get judgeCoder () {
    return this.judgeCoderTools;
  }

  async judge (problemType: ProblemType, userAnswer: any, userId: number, ip: string) {
    const problem = await this.db.problem.findOne(userAnswer.problemId);
    if (!problem) {
      throw new UnifyException("未查询到题", Errcode.NO_FIND);
    }
    if (problem.type !== problemType) {
      throw new UnifyException("编号和题类型不正确", Errcode.TYPE);
    }

    const solution = await this.createSolution(userAnswer.problemId, userId, ip);

    await this[problemType](problem, solution, userAnswer);

    return solution;
  }

  async gameJudge (problemType: ProblemType, userAnswer: any, userId: number, ip: string, gameId = 0, gameProblemId = 0, groupId = 0) {
    const problem = await this.db.problem.findOne(userAnswer.problemId);
    if (!problem) {
      throw new UnifyException("未查询到题", Errcode.NO_FIND);
    }
    if (problem.type !== problemType) {
      throw new UnifyException("编号和题类型不正确", Errcode.TYPE);
    }

    const solution = await this.createSolution(userAnswer.problemId, userId, ip);
    solution.game_id = gameId;
    solution.game_problem_id = gameProblemId;
    solution.group_id = groupId;
    await this[problemType](problem, solution, userAnswer);

    return solution;
  }

  async createSolution (problemId, userId, ip) {
    const solution = new Solution();
    solution.probleme_id = problemId;
    solution.user_id = userId;
    solution.ip = ip;
    return solution;
  }

  async single (problem: Problem, solution: Solution, userAnswer: SingleBodyDto) {
    const solutionData = new SolutionSingle();
    solutionData.answer = userAnswer.answer;
    solution.type = problem.type;
    solution.data = solutionData;

    return await this.createTask(problem, solution);
  }

  async multi (problem: Problem, solution: Solution, userAnswer: MultiBodyDto) {
    const solutionData = new SolutionMulti();
    solutionData.answers = userAnswer.answers;
    solution.type = problem.type;
    solution.data = solutionData;

    return await this.createTask(problem, solution);
  }

  async fill (problem: Problem, solution: Solution, userAnswer: FillBodyDto) {
    const solutionData = new SolutionFill();
    solutionData.answer = userAnswer.answer;
    solution.type = problem.type;
    solution.data = solutionData;
    return await this.createTask(problem, solution);
  }

  async code (problem: Problem, solution: Solution, userAnswer: CodeBodyDto) {
    const solutionData = new SolutionCode();
    solutionData.src = userAnswer.src;
    solutionData.isOutput = userAnswer.isOutput;
    solutionData.lang = userAnswer.lang;
    solution.type = problem.type;
    solution.data = solutionData;
    return await this.createTask(problem, solution);
  }

  async createTask (problem: Problem, solution: Solution) {
    const _solution = await this.db.solution.save(solution);
    const job = await this.judgerQueue.add(problem.type, { problemId: problem.id, solutionId: _solution.id });
    _solution.job_id = String(job.id);
    return _solution;
  }

  async getJobs (page: PageQueryDto) {
    const arr = await this.judgerQueue.getJobs(["completed", "waiting", "failed"]);
    const res = await PageQueryValidationPipe.queryArr(arr, page);
    console.log(res)
    return res;
  }
}
