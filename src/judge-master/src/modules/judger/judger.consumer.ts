import { SolutionCode, SolutionFill, SolutionMulti, SolutionSingle } from './../../db/entities/solution-type';
import { Process, Processor } from "@nestjs/bull";
import { HttpService } from "@nestjs/common";
import { Job } from "bull";
import { ProblemCode, ProblemFill, ProblemMulti, ProblemSingle } from "src/db/entities/problem-type";
import { JobJudgeDto } from "./dto/job-judge.dto";
import { Result } from "./judger.type";
import { Solution } from 'src/db/entities/solution';
import { ConfigService } from '@nestjs/config'; import { DbService } from 'src/db/db.service';

@Processor('judger')
export class JudgerConsumer {

  constructor(
    private httpService: HttpService,
    private configService: ConfigService,
    private db: DbService
  ) { }

  @Process('code')
  async judgeCode (job: Job<JobJudgeDto>) {
    const res = await this.httpService.get('https://baidu.com')
    console.log(res);
    return { resHello: 'world' }
  }

  @Process('single')
  async judgeSingle (job: Job<JobJudgeDto>) {
    const { problem, solutionId } = job.data;
    const solution = await this.db.solution.findOne(solutionId);
    const problemData = problem.data as ProblemSingle;
    const solutionData = solution.data as SolutionSingle
    const result: Result = problemData.answer === solutionData.answer ? Result.OK : Result.ANSWER_ERR;
    solution.result = result;
    solution.job_id = String(job.id);
    await this.db.solution.save(solution);
    return solution;
  }

  @Process('multi')
  async judgeMulti (job: Job<JobJudgeDto>) {
    const { problem, solutionId } = job.data;
    const solution = await this.db.solution.findOne(solutionId);
    solution.job_id = String(job.id);
    const problemData = problem.data as ProblemMulti;
    const solutionData = solution.data as SolutionMulti;
    const userAnswers = solutionData.answers;
    solution.result = Result.OK;
    problemData.answers.forEach(answer => {
      if (userAnswers.indexOf(answer) === -1) {
        solution.result = Result.ANSWER_ERR;
      }
    })
    await this.db.solution.save(solution);
    return solution;
  }

  @Process('fill')
  async judgeFill (job: Job<JobJudgeDto>) {
    const { problem, solutionId } = job.data;
    const solution = await this.db.solution.findOne(solutionId);
    const problemData = problem.data as ProblemFill;
    const solutionData = solution.data as SolutionFill;

    solution.result = Result.ANSWER_ERR;

    for (let i = 0; i < problemData.keywords.length; i++) {
      const keyword = problemData.keywords[i];
      if (solutionData.answer.indexOf(keyword) !== -1) {
        solution.result = Result.OK;
        break;
      }
    }

    for (let i = 0; i < problemData.nokeywords.length; i++) {
      const nokeyword = problemData.nokeywords[i];
      if (solutionData.answer.indexOf(nokeyword) !== -1) {
        solution.result = Result.ANSWER_ERR;
        break;
      }
    }

    solution.job_id = String(job.id);
    await this.db.solution.save(solution);
    return solution;
  }
}