import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class PutValidationPipe implements PipeTransform {
  transform (value: any, metadata: ArgumentMetadata) {
    console.log(value, metadata);
    return value;
  }
}
