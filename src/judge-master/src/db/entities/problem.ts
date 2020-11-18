import { Entity, Column, Repository } from "typeorm";
import { Common } from "./common";
import { ProblemClass, ProblemType } from "./problem-type";
import { arrayAndString } from "./transformers";

export type ProblemRepository = Repository<Problem>

@Entity()
export class Problem extends Common {

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  hint: string;

  @Column()
  source: string;

  @Column({ type: 'varchar', nullable: true, transformer: arrayAndString })
  tags: string[];

  @Column({ default: 0 })
  ac_num: number;

  @Column({ default: 0 })
  submit_num: number;

  @Column({ default: 0 })
  hard: number;

  @Column({ default: 0 })
  create_user_id: number;

  @Column({ type: 'enum', enum: ProblemType })
  type: ProblemType;

  @Column({ type: 'json', default: '{}' })
  data: ProblemClass;
}