import { IsBoolean, IsEnum, IsInt, IsNumber, IsString } from "class-validator";
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


export class CodeGameBodyDto {
  @IsNumber()
  gameId: number; // 比赛ID 0=不是比赛

  @IsNumber()
  gameProblemId: number; //题ID

  @IsNumber()
  groupId: number; // 如果等于0表示不是组比赛

  @IsString()
  src: string;

  @IsEnum(LangType)
  lang: LangType;

  @IsBoolean()
  isOutput: boolean;
}