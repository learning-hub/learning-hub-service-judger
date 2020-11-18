import { IsArray } from "class-validator";
import { ProblemBodyDto } from "./problem-body.dto";

export class ProblemFillBodyDto extends ProblemBodyDto {
  @IsArray()
  keywords: string[];

  @IsArray()
  nokeywords: string[];
}