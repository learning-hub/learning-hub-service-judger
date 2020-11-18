import { Solution } from './../../db/entities/solution';
import { InjectQueue } from '@nestjs/bull';
import { BadRequestException, Injectable } from '@nestjs/common';
import { Queue } from 'bull';
import { ProblemType } from 'src/db/entities/problem-type';
import { ProblemService } from '../problem/problem.service';
import { DbService } from 'src/db/db.service';
import { SolutionFill, SolutionMulti, SolutionSingle } from 'src/db/entities/solution-type';
import { Problem } from 'src/db/entities/problem';
import { UserAnswer } from './dto/user-answer.dto';
import { SingleBodyDto } from './dto/single-body.dto';
import { MultiBodyDto } from './dto/multi-body.dto';
import { FillBodyDto } from './dto/fill-body.dto';

@Injectable()
export class JudgerService {

  constructor(
    @InjectQueue('judger') private judgerQueue: Queue,
    private db: DbService,
    private problemService: ProblemService
  ) { }

  async judge (type: ProblemType, userAnswer: any, userId: number, ip: string) {
    const problem = await this.db.problem.findOne(userAnswer.problemId);
    if (!problem) {
      throw new BadRequestException("未查询到题");
    }
    if (problem.type !== type) {
      throw new BadRequestException("编号和题类型不正确");
    }

    const solution = await this.createSolution(userAnswer.problemId, userId, ip);

    await this[type](problem, solution, userAnswer)

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

  async code () {
    return {}
  }

  async createTask (problem: Problem, solution: Solution) {
    const _solution = await this.db.solution.save(solution);
    const job = await this.judgerQueue.add(problem.type, { problem, solutionId: _solution.id });
    _solution.job_id = String(job.id);
    return _solution;
  }
}
