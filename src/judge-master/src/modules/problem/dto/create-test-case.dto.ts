import { IsString } from "class-validator";

export class CreateTestCaseDto {
  @IsString()
  input: string;

  @IsString()
  output: string;
}