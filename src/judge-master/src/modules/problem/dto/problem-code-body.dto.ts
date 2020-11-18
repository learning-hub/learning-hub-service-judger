import { IsNumber, IsString } from "class-validator";
import { ProblemBodyDto } from "./problem-body.dto";

export class ProblemCodeBodyDto extends ProblemBodyDto {
  @IsString()
  input: string;

  @IsString()
  output: string;

  @IsString()
  sample_input: string;

  @IsString()
  sample_output: string;

  @IsNumber()
  time_limit: number;

  @IsNumber()
  memory_limit: number;

  @IsString()
  src: string;
}