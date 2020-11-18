
import { LangType } from "src/modules/judger/judger.type";

export type SolutionClass = SolutionCode | SolutionSingle | SolutionMulti | SolutionFill

export class SolutionCode {
  time: string;

  memory: number;

  lang: LangType;

  src: string;
}

export class SolutionSingle {
  answer: string;
}

export class SolutionMulti {
  answers: string[];
}

export class SolutionFill {
  answer: string;
}

