import { HttpException } from "@nestjs/common";

export enum Errcode {
  UNKNOWN = 3000, //未知错误
  TYPE = 3001, // 类型错误
  NO_FIND = 3002, //未找到题
  JUDGER_SERVER_ERR = 3003, //判题机错误
}

export class UnifyException extends HttpException {
  constructor(message, errcode: Errcode = Errcode.UNKNOWN) {
    super({ statusCode: errcode, error: 'unify exception', message }, errcode);
  }
}