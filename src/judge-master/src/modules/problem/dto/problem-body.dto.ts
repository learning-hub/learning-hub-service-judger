import { IsArray, IsBoolean, IsNumber, IsString } from "class-validator";

export class ProblemBodyDto {
  @IsBoolean()
  is_disabled: boolean;

  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsString()
  hint: string; // 提示

  @IsString()
  source: string; //来源

  @IsArray()
  tags: string[]; // 标签 如: 算法;数据结构

  @IsNumber()
  hard: number; //难度
}