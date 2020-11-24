import { IsBoolean, IsEnum, IsInt, IsString } from "class-validator";
import { LangType } from "../judger.type";

export class CodeBodyDto {
  @IsInt()
  problemId: number;

  @IsString()
  src: string;

  @IsEnum(LangType)
  lang: LangType;

  @IsBoolean()
  isOutput: boolean;
}