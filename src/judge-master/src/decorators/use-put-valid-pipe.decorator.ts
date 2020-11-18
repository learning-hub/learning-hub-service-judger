import { SetMetadata, applyDecorators, UsePipes, ValidationPipe } from '@nestjs/common';

export const UsePutValidPipe = (...args: string[]) => applyDecorators(
  SetMetadata('use-valid-pipe', args),
  UsePipes(new ValidationPipe({ skipMissingProperties: true }))
);
