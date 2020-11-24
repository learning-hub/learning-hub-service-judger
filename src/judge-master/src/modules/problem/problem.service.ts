import { ProblemCodeBodyDto } from './dto/problem-code-body.dto';
import { ProblemBodyDto } from './dto/problem-body.dto';
import { Problem } from './../../db/entities/problem';
import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { DbService } from 'src/db/db.service';
import { ProblemSingleBodyDto } from './dto/problem-single-body.dto';
import { ProblemType } from 'src/db/entities/problem-type';
import { ProblemMultiBodyDto } from './dto/problem-multi-body.dto';
import { ProblemFillBodyDto } from './dto/problem-fill-body.dto';
import { promises as fsp } from 'fs';
import * as fs from 'fs'
import { promisify } from 'util'
import { ConfigService } from '@nestjs/config';
import { join } from 'path';
import { wrap } from 'src/tools/promise.tools';
import { md5 } from 'src/tools/crypto.tools';

function createTestCaseInfo (input: string, output: string, inputName: string, outputName: string) {
  const testCaseInfo = `{
    "test_case_number": 1,
    "spj": false,
    "test_cases": {
      "1": {
        "stripped_output_md5": "${md5(output.replace(/\s/igm, ''))}",
        "output_size": ${output.length},
        "output_md5": "${md5(output)}",
        "input_name": "${inputName}",
        "input_size": ${input.length},
        "output_name": "${outputName}"
      }
    }
  }`
  return testCaseInfo;
}

@Injectable()
export class ProblemService {
  constructor(
    private db: DbService,
    private configService: ConfigService
  ) { }

  get repo () {
    return this.db.problem;
  }

  async createProblem<T extends ProblemBodyDto> (problemDto: T) {
    const problem = new Problem();
    problem.title = problemDto.title;
    problem.description = problemDto.description;
    problem.is_disabled = problemDto.is_disabled;
    problem.hint = problemDto.hint;
    problem.source = problemDto.source;
    problem.tags = problemDto.tags;
    problem.hard = problemDto.hard;

    if (problemDto instanceof ProblemSingleBodyDto) {
      problem.data = new ProblemSingleBodyDto();
      problem.data.answer = problemDto.answer;
      problem.data.options = problemDto.options;
      problem.type = ProblemType.SINGLE;
    } else if (problemDto instanceof ProblemMultiBodyDto) {
      problem.data = new ProblemMultiBodyDto();
      problem.data.answers = problemDto.answers;
      problem.data.options = problemDto.options;
      problem.type = ProblemType.MULTI;
    } else if (problemDto instanceof ProblemFillBodyDto) {
      problem.data = new ProblemFillBodyDto();
      problem.data.keywords = problemDto.keywords;
      problem.data.nokeywords = problemDto.nokeywords;
      problem.type = ProblemType.FILL;
    } else if (problemDto instanceof ProblemCodeBodyDto) {
      problem.data = new ProblemCodeBodyDto();
      problem.data.input = problemDto.input;
      problem.data.output = problemDto.output;
      problem.data.sample_input = problemDto.sample_input;
      problem.data.sample_output = problemDto.sample_output;
      problem.data.time_limit = problemDto.time_limit;
      problem.data.memory_limit = problemDto.memory_limit;
      problem.data.src = problemDto.src;
      problem.type = ProblemType.CODE;
    } else {
      throw new InternalServerErrorException();
    }

    return problem;
  }

  updateProblem (problem: Problem, updateProblem: any) {
    const fields = Object.keys(updateProblem);
    for (let i = 0; i < fields.length; i++) {
      const field = fields[i];
      problem[field] = updateProblem[field];
    }
    return problem;
  }

  async createTestCase (problemId: number, input: string, output: string) {
    const problem = await this.db.problem.findOne(problemId);
    if (!problem) {
      throw new BadRequestException("暂无该题，无法创建测试");
    }
    if (problem.type !== ProblemType.CODE) {
      throw new BadRequestException("错误题类型");
    }
    const testCasePath = this.configService.get<string>('TEST_CASE_PATH');
    if (!testCasePath) {
      throw new BadRequestException("缺少TEST_CASE_PATH环境变量值");
    }
    const currentPath = join(testCasePath, String(problemId));
    await fsp.mkdir(currentPath, { recursive: true });

    const info = createTestCaseInfo(input, output, '1.in', '1.out');

    await fsp.writeFile(join(currentPath, 'info'), info)

    await fsp.writeFile(join(currentPath, '1.in'), input)

    await fsp.writeFile(join(currentPath, '1.out'), output)

    return info;
  }

  async removeTestCase (problemId: number) {
    if (typeof problemId !== 'number') {
      throw new BadRequestException("ProblemId不正确");
    }
    const testCasePath = this.configService.get<string>('TEST_CASE_PATH');
    if (!testCasePath) {
      throw new BadRequestException("缺少TEST_CASE_PATH环境变量值");
    }

    const currentPath = join(testCasePath, String(problemId));
    await wrap(promisify((fs as any).rm)(currentPath, { recursive: true }))
    return null;
  }

  async findTestCase (problemId: number) {
    const testCasePath = this.configService.get<string>('TEST_CASE_PATH');
    if (!testCasePath) {
      throw new BadRequestException("缺少TEST_CASE_PATH环境变量值");
    }
    const currentPath = join(testCasePath, String(problemId));
    const [errInfo, info] = await wrap(fsp.readFile(join(currentPath, 'info'), { encoding: 'utf8' }));
    const [errInput, input] = await wrap(fsp.readFile(join(currentPath, '1.in'), { encoding: 'utf8' }));
    const [errOutput, output] = await wrap(fsp.readFile(join(currentPath, '1.out'), { encoding: 'utf8' }));
    if (errInfo || errOutput || errInput) {
      throw new BadRequestException("读取TestCase错误，文件不存在");
    }
    return {
      info,
      input,
      output
    }
  }
}
