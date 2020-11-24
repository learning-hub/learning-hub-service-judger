import { IsArray, IsNumber } from "class-validator";

export class MultiBodyDto {
  @IsNumber()
  problemId: number;

  @IsArray()
  answers: string[];
}

export class MultiGameBodyDto {
  @IsNumber()
  gameId: number; // 比赛ID 0=不是比赛

  @IsNumber()
  gameProblemId: number; //题ID

  @IsNumber()
  groupId: number; // 如果等于0表示不是组比赛

  @IsArray()
  answers: string[];
}