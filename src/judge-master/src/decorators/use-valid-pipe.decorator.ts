import { SetMetadata, applyDecorators, UsePipes, ValidationPipe } from '@nestjs/common';

export const UseValidPipe = (...args: string[]) => applyDecorators(
  SetMetadata('use-valid-pipe', args),
  UsePipes(new ValidationPipe({ transform: true }))
);
