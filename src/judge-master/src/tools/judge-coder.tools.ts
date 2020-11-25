import Axios, { AxiosInstance } from 'axios'
import { langConfig, LangType } from "src/modules/judger/judger.type";
import { sha256 } from "./crypto.tools";
import { wrap } from "./promise.tools";

export class JudgeCoderTools {
  private judgeToken: string;
  private http: AxiosInstance;
  constructor(judgeBaseURL: string, judgeToken: string) {
    this.judgeToken = sha256(judgeToken);
    this.http = Axios.create({
      baseURL: judgeBaseURL,
      headers: {
        'X-Judge-Server-Token': this.judgeToken
      }
    });
  }

  async judge (problemId: number, lang: LangType, src: string, timeLimit: number, memoryLimit: number, isOutput = false) {
    return await wrap(this.http.post('/judge', {
      "language_config": langConfig[lang + '_lang_config'],
      "src": src, //"#include \"stdio.h\"\nint main(){\n  int a,b;\n  while(scanf(\"%d%d\", &a, &b)!=EOF){\n    printf(\"%d\\n\", a+b);\n  }\n  return 0;\n}"
      "max_cpu_time": timeLimit,
      "max_memory": memoryLimit,
      "test_case_id": String(problemId),
      "output": isOutput
    }))
  }

  async ping () {
    return await wrap(this.http.post('/ping'))
  }
}