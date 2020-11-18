import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm/dist";
import { Problem, ProblemRepository } from "./entities/problem";
import { Solution, SolutionRepository } from "./entities/solution";

@Injectable()
export class DbService {
  constructor(
    @InjectRepository(Problem) private problemRepository: ProblemRepository,
    @InjectRepository(Solution) private solutionsRepository: SolutionRepository
  ) { }

  get problem () {
    return this.problemRepository;
  }

  get solution () {
    return this.solutionsRepository;
  }
}