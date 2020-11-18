import { IsArray, IsNumber } from "class-validator";

export class MultiBodyDto {
  @IsNumber()
  problemId: number;

  @IsArray()
  answers: string[];
}