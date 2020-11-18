import { Problem } from "src/db/entities/problem";

export class JobJudgeDto {
  problem: Problem;
  solutionId: number;
}