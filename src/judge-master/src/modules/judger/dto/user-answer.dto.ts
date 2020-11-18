import { CodeBodyDto } from "./code-body.dto"
import { FillBodyDto } from "./fill-body.dto"
import { MultiBodyDto } from "./multi-body.dto"
import { SingleBodyDto } from "./single-body.dto"

export type UserAnswer = SingleBodyDto | MultiBodyDto | FillBodyDto | CodeBodyDto