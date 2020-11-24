import { IsNumber, IsString } from "class-validator";

export class SingleBodyDto {
  @IsNumber()
  problemId: number;

  @IsString()
  answer: string;
}

export class SingleGameBodyDto {
  @IsNumber()
  gameId: number; // 比赛ID 0=不是比赛

  @IsNumber()
  gameProblemId: number; //题ID

  @IsNumber()
  groupId: number; // 如果等于0表示不是组比赛

  @IsString()
  answer: string;
}