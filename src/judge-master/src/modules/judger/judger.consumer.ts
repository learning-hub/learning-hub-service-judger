import { SolutionCode, SolutionFill, SolutionMulti, SolutionSingle } from './../../db/entities/solution-type';
import { Process, Processor } from "@nestjs/bull";
import { HttpService } from "@nestjs/common";
import { Job } from "bull";
import { ProblemCode, ProblemFill, ProblemMulti, ProblemSingle } from "src/db/entities/problem-type";
import { JobJudgeDto } from "./dto/job-judge.dto";
import { langConfig, Result } from "./judger.type";
import { ConfigService } from '@nestjs/config'; import { DbService } from 'src/db/db.service';
import { sha256 } from 'src/tools/crypto.tools';
import { qdToInner } from 'src/tools/transfrom.tools';

@Processor('judger')
export class JudgerConsumer {

  constructor(
    private httpService: HttpService,
    private configService: ConfigService,
    private db: DbService
  ) { }

  @Process('code')
  async judgeCode (job: Job<JobJudgeDto>) {
    const { problemId, solutionId } = job.data;
    const problem = await this.db.problem.findOne(problemId);
    const solution = await this.db.solution.findOne(solutionId);
    const problemData = problem.data as ProblemCode;
    const solutionData = solution.data as SolutionCode;

    const judgeToken = sha256(this.configService.get<string>('JUDGE_CODER_TOKEN'));
    const judgeApi = this.configService.get<string>('JUDGE_CODER_SERVER') + '/judge';
    const res = await this.httpService.post(judgeApi, {
      "language_config": langConfig[solutionData.lang + '_lang_config'],
      "src": solutionData.src, //"#include \"stdio.h\"\nint main(){\n  int a,b;\n  while(scanf(\"%d%d\", &a, &b)!=EOF){\n    printf(\"%d\\n\", a+b);\n  }\n  return 0;\n}"
      "max_cpu_time": problemData.time_limit,
      "max_memory": problemData.memory_limit,
      "test_case_id": String(problem.id),
      "output": solutionData.isOutput
    },
      {
        headers: {
          'X-Judge-Server-Token': judgeToken
        }
      }
    ).toPromise()

    let result = Result.JUDGEING;
    if (res.data.err) {
      result = Result.COMPILE_ERR;
    } else {
      result = qdToInner(res.data.data[0]?.result);
    }

    solution.result = result;
    solutionData.output = res?.data?.data[0]?.output;
    solutionData.time = res?.data?.data[0]?.real_time;
    solutionData.memory = res?.data?.data[0]?.memory;

    solution.job_id = String(job.id);
    await this.db.solution.save(solution);
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
    await this.db.solution.save(solution);
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
    await this.db.solution.save(solution);
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
    await this.db.solution.save(solution);
    return solution;
  }
}