import { Result } from "src/modules/judger/judger.type"

export const QdOjResult = {
  "-1": Result.ANSWER_ERR,
  "0": Result.OK,
  "1": Result.TIME_OVER,
  "2": Result.TIME_OVER,
  "3": Result.MEMORY_OVER,
  "4": Result.RUN_ERR,
  "5": Result.SYS_ERR
}

export class TransformTools {
  static qdOjResultToInnerResult (qdOjResult): Result {
    return QdOjResult[qdOjResult] ?? QdOjResult['5'];
  }
}

export const qdToInner = TransformTools.qdOjResultToInnerResult