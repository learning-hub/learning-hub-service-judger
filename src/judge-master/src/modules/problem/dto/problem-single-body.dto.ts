import { IsArray, IsString } from "class-validator";
import { ProblemBodyDto } from "./problem-body.dto";

export class ProblemSingleBodyDto extends ProblemBodyDto {
  @IsArray()
  options: string[];

  @IsString()
  answer: string;
}