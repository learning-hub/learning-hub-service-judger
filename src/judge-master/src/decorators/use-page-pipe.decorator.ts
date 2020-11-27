import { applyDecorators, UsePipes } from '@nestjs/common';
import { PageQueryValidationPipe } from 'src/pipes/page-query-validation.pipe';

export const UsePagePipe = () => applyDecorators(
  UsePipes(new PageQueryValidationPipe())
);
