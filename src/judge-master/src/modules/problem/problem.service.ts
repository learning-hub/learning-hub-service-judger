import { ProblemCodeBodyDto } from './dto/problem-code-body.dto';
import { ProblemBodyDto } from './dto/problem-body.dto';
import { Problem } from './../../db/entities/problem';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { DbService } from 'src/db/db.service';
import { ProblemSingleBodyDto } from './dto/problem-single-body.dto';
import { ProblemCode, ProblemFill, ProblemMulti, ProblemSingle, ProblemType } from 'src/db/entities/problem-type';
import { ProblemMultiBodyDto } from './dto/problem-multi-body.dto';
import { ProblemFillBodyDto } from './dto/problem-fill-body.dto';
import { PageQueryDto } from './dto/page-query.dto';
import { In, Like } from 'typeorm';

@Injectable()
export class ProblemService {
  constructor(
    private db: DbService
  ) { }

  get repository () {
    return this.db.problem;
  }

  createProblem<T extends ProblemBodyDto> (problemDto: T) {
    const problem = new Problem();
    problem.title = problemDto.title;
    problem.description = problemDto.description;
    problem.is_disabled = problemDto.is_disabled;
    problem.hint = problemDto.hint;
    problem.source = problemDto.source;
    problem.tags = problemDto.tags;
    problem.hard = problemDto.hard;

    if (problemDto instanceof ProblemSingleBodyDto) {
      problem.data = new ProblemSingle();
      problem.data.options = problemDto.options;
      problem.data.answer = problemDto.answer;
      problem.type = ProblemType.SINGLE;
    } else if (problemDto instanceof ProblemMultiBodyDto) {
      problem.data = new ProblemMulti();
      problem.data.options = problemDto.options;
      problem.data.answers = problemDto.answers;
      problem.type = ProblemType.MULTI;
    } else if (problemDto instanceof ProblemFillBodyDto) {
      problem.data = new ProblemFill();
      problem.data.keywords = problemDto.keywords;
      problem.data.nokeywords = problemDto.nokeywords;
      problem.type = ProblemType.FILL;
    } else if (problemDto instanceof ProblemCodeBodyDto) {
      problem.data = new ProblemCode();
      problem.data.memory_limit = problemDto.memory_limit;
      problem.data.time_limit = problemDto.time_limit;
      problem.data.input = problemDto.input;
      problem.data.output = problemDto.output;
      problem.data.sample_input = problemDto.sample_input;
      problem.data.sample_output = problemDto.sample_output;
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

  async finds (pageDto: PageQueryDto) {
    const select: any = {};
    if (pageDto.orderParse) {
      select.order = { [pageDto.orderParse.field]: pageDto.orderParse.value };
    }
    if (pageDto.filterParse) {
      switch (pageDto.filterParse.modify) {
        case 'like':
          select.where = {
            [pageDto.filterParse.field]: Like('%' + pageDto.filterParse.value + '%')
          };
          break;
        case 'in':
          const arr = pageDto.filterParse.value.split(',');
          select.where = { [pageDto.filterParse.field]: In(arr) };
          break;
        default:
          select.where = { [pageDto.filterParse.field]: pageDto.filterParse.value };
      }
    }
    select.skip = (pageDto.pageNum - 1) * pageDto.pageSize;
    select.take = pageDto.pageSize;
    const total = await this.db.problem.count(select);
    const data = await this.db.problem.find(select);
    const body = {
      list: data,
      page: { num: pageDto.pageNum, size: pageDto.pageSize, total }
    }
    return body;
  }
}
