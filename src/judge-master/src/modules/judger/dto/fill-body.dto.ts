import { IsNumber, IsString } from "class-validator";

export class FillBodyDto {
  @IsNumber()
  problemId: number;

  @IsString()
  answer: string;
}