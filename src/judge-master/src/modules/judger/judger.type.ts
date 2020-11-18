export enum Result {
  OK = 0,
  JUDGEING = 1,
  FORMAT_ERR = 2,
  ANSWER_ERR = 3,
  TIME_OVER = 4,
  MEMORY_OVER = 5,
  RUN_ERR = 6,
  COMPILE_ERR = 7
}

export enum LangType {
  C = 'c',
  CPP = 'cpp',
  JAVA = 'java',
  PY2 = 'py2',
  PY3 = 'py3'
}