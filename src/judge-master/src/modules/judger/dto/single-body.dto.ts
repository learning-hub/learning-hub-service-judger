import { IsNumber, IsString } from "class-validator";

export class SingleBodyDto {
  @IsNumber()
  problemId: number;

  @IsString()
  answer: string;
}