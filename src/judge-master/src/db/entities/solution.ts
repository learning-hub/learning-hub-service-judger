import { Result } from "src/modules/judger/judger.type";
import { Entity, Column, Repository } from "typeorm";
import { Common } from "./common";
import { ProblemType } from "./problem-type";
import { SolutionClass } from "./solution-type";

export type SolutionRepository = Repository<Solution>

@Entity()
export class Solution extends Common {
  @Column({ default: 0 })
  game_id: number;

  @Column({ default: 0 })
  game_problem_id: number;

  @Column({ default: 0 })
  probleme_id: number;

  @Column({ default: 0 })
  user_id: number;

  @Column({ default: 0 })
  group_id: number;

  @Column({ default: "0.0.0.0" })
  ip: string;

  @Column({ type: 'enum', enum: Result, default: Result.QUEUE })
  result: Result;

  @Column({ type: 'varchar', default: '0' })
  job_id: string;

  @Column({ type: 'enum', enum: ProblemType })
  type: ProblemType;

  @Column({ type: 'json', default: '{}' })
  data: SolutionClass;
}