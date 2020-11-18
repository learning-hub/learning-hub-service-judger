import { FilterParse, OrderParse, Sort } from './../modules/problem/dto/page-query.dto';
import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { PageQueryDto } from 'src/modules/problem/dto/page-query.dto';

@Injectable()
export class PageQueryValidationPipe implements PipeTransform {
  private fields: string[] = [];
  constructor(fields: string[]) {
    this.fields = fields;
  }
  transform (value: PageQueryDto, meta: ArgumentMetadata) {
    if (meta.metatype.name !== PageQueryDto.name) {
      return value;
    }
    if (typeof value !== 'object') {
      return value;
    }

    if (value?.filter) {
      const res = this.directiveParser(value.filter);
      if (!this.validateField(res.field)) {
        throw new BadRequestException();
      }
      if (!this.validateModify(res.modify)) {
        throw new BadRequestException();
      }
      value.filterParse = new FilterParse();
      value.filterParse.value = res.value;
      value.filterParse.field = res.field;
      value.filterParse.modify = res.modify;
    }

    if (value?.order) {
      const res = this.directiveParser(value.order);
      if (!this.validateField(res.field)) {
        throw new BadRequestException();
      }
      if (!this.validateSort(res.value)) {
        throw new BadRequestException();
      }
      value.orderParse = new OrderParse();
      value.orderParse.value = res.value as Sort;
      value.orderParse.field = res.field;
    }

    value.pageNum = Number(value.pageNum || 1);
    value.pageSize = Number(value.pageSize || 30);

    return value;
  }

  directiveParser (directiveStr: string, { defaultM = 'like' }: any = {}) {
    const [km, v] = directiveStr.split(':');
    const [k, m = defaultM] = km.split('@');
    return {
      field: k,
      modify: m,
      value: v
    }
  }

  validateField (field) {
    return this.fields.indexOf(field) !== -1;
  }

  validateSort (sort) {
    const _sort = { ASC: true, DESC: true };
    return Boolean(_sort[sort]);
  }

  validateModify (moify) {
    const _moify = { default: true, like: true, in: true };
    return Boolean(_moify[moify]);
  }
}
