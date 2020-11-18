import { ProblemBodyDto } from './problem-body.dto';
import { IsArray } from "class-validator";

export class ProblemMultiBodyDto extends ProblemBodyDto {
  @IsArray()
  options: string[];

  @IsArray()
  answers: string[];
}