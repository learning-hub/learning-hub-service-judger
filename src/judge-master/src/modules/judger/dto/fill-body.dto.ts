import { IsNumber, IsString } from "class-validator";

export class FillBodyDto {
  @IsNumber()
  problemId: number;

  @IsString()
  answer: string;
}

export class FillGameBodyDto {
  @IsNumber()
  gameId: number; // 比赛ID 0=不是比赛

  @IsNumber()
  gameProblemId: number; //题ID

  @IsNumber()
  groupId: number; // 如果等于0表示不是组比赛

  @IsString()
  answer: string;
}