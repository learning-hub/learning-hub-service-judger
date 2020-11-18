
export enum ProblemType {
  CODE = "code",
  SINGLE = "single",
  MULTI = "multi",
  FILL = "fill"
}

export type ProblemClass = ProblemFill | ProblemCode | ProblemSingle | ProblemMulti

export class ProblemCode {
  input: string;

  output: string;

  sample_input: string;

  sample_output: string;

  time_limit: number;

  memory_limit: number;

  src: string;
}

export class ProblemSingle {
  options: string[];

  answer: string;
}

export class ProblemMulti {
  options: string[];

  answers: string[];
}

export class ProblemFill {
  keywords: string[];

  nokeywords: string[];
}
