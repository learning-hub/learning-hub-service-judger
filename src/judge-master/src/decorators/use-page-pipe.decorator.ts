import { applyDecorators, UsePipes } from '@nestjs/common';
import { PageQueryValidationPipe } from 'src/pipes/page-query-validation.pipe';

export const UsePagePipe = (fields: string[]) => applyDecorators(
  UsePipes(new PageQueryValidationPipe(fields))
);
