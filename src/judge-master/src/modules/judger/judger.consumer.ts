import { SolutionCode, SolutionFill, SolutionMulti, SolutionSingle } from './../../db/entities/solution-type';
import { Process, Processor } from "@nestjs/bull";
import { Job } from "bull";
import { ProblemCode, ProblemFill, ProblemMulti, ProblemSingle } from "src/db/entities/problem-type";
import { JobJudgeDto } from "./dto/job-judge.dto";
import { Result } from "./judger.type";
import { DbService } from 'src/db/db.service';
import { qdToInner } from 'src/tools/transfrom.tools';
import { JudgerService } from './judger.service';

@Processor('judger')
export class JudgerConsumer {
  constructor(
    private db: DbService,
    private judgerService: JudgerService
  ) { }

  @Process('code')
  async judgeCode (job: Job<JobJudgeDto>) {
    const { problemId, solutionId } = job.data;
    const problem = await this.db.problem.findOne(problemId);
    const solution = await this.db.solution.findOne(solutionId);
    const problemData = problem.data as ProblemCode;
    const solutionData = solution.data as SolutionCode;

    let result = Result.JUDGEING;
    solution.result = result;
    await this.db.solution.save(solution);
    await job.progress(20);
    const [err, res] = await this.judgerService.judgeCoder.judge(problem.id, solutionData.lang, solutionData.src, problemData.time_limit, problemData.memory_limit);

    if (err) {
      result = Result.JUDGE_ERR;
      solution.result = result;
      await this.db.solution.save(solution);
      throw new Error("judge coder err");
    }
    await job.progress(40);
    if (res.data.err) {
      result = Result.COMPILE_ERR;
    } else {
      result = qdToInner(res.data.data[0]?.result);
    }
    await job.progress(50);
    solution.result = result;
    solutionData.output = res?.data?.data[0]?.output;
    solutionData.time = res?.data?.data[0]?.real_time;
    solutionData.memory = res?.data?.data[0]?.memory;

    solution.job_id = String(job.id);
    await this.db.solution.save(solution);
    await job.progress(100);
    return solution;
  }

  @Process('single')
  async judgeSingle (job: Job<JobJudgeDto>) {
    const { problemId, solutionId } = job.data;
    const problem = await this.db.problem.findOne(problemId);
    const solution = await this.db.solution.findOne(solutionId);
    const problemData = problem.data as ProblemSingle;
    const solutionData = solution.data as SolutionSingle
    const result: Result = problemData.answer === solutionData.answer ? Result.OK : Result.ANSWER_ERR;
    solution.result = result;
    solution.job_id = String(job.id);
    await job.progress(50)
    await this.db.solution.save(solution);
    await job.progress(100)
    return solution;
  }

  @Process('multi')
  async judgeMulti (job: Job<JobJudgeDto>) {
    const { problemId, solutionId } = job.data;
    const problem = await this.db.problem.findOne(problemId);
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
    await job.progress(50)
    await this.db.solution.save(solution);
    await job.progress(100)
    return solution;
  }

  @Process('fill')
  async judgeFill (job: Job<JobJudgeDto>) {
    const { problemId, solutionId } = job.data;
    const problem = await this.db.problem.findOne(problemId);
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
    await job.progress(50)
    await this.db.solution.save(solution);
    await job.progress(100)
    return solution;
  }
}