import { FilterParse, OrderParse, Sort } from '../dto/page-query.dto';
import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { PageQueryDto } from 'src/dto/page-query.dto';
import { Like, In, Not } from 'typeorm';
import { wrap } from 'src/tools/promise.tools';

@Injectable()
export class PageQueryValidationPipe implements PipeTransform {
  transform (value: PageQueryDto, meta: ArgumentMetadata) {
    if (meta.metatype.name !== PageQueryDto.name) {
      return value;
    }
    if (typeof value !== 'object') {
      return value;
    }

    if (value?.filter) {
      const res = this.directiveParser(value.filter);
      if (!this.validateModify(res.modify)) {
        throw new BadRequestException("filter modify err");
      }
      value.filterParse = new FilterParse();
      value.filterParse.value = res.value;
      value.filterParse.field = res.field;
      value.filterParse.modify = res.modify;
      value.filterParse.not = res.not;
    }

    if (value?.order) {
      const res = this.directiveParser(value.order);
      if (!this.validateSort(res.value)) {
        throw new BadRequestException("order sort err");
      }
      value.orderParse = new OrderParse();
      value.orderParse.value = res.value as Sort;
      value.orderParse.field = res.field;
    }

    value.pageNum = Number(value.pageNum || 1);
    value.pageSize = Number(value.pageSize || 30);

    return value;
  }

  directiveParser (directiveStr: string, { defaultM = 'default' }: any = {}) {
    const [km, value] = directiveStr.split(':');
    const [field, m = defaultM] = km.split('@');
    let not = false;
    let modify = m;
    if (m[0] === '!') {
      not = true;
      modify = modify?.substring(1);
    }
    return {
      field,
      modify,
      value,
      not,
    }
  }

  validateSort (sort) {
    const _sort = { ASC: true, DESC: true };
    return Boolean(_sort[sort]);
  }

  validateModify (moify) {
    const _moify = { default: true, like: true, in: true };
    return Boolean(_moify[moify]);
  }


  static async queryRepo (repository: any, pageQueryDto: PageQueryDto) {
    const select: any = {};
    if (pageQueryDto?.orderParse) {
      select.order = { [pageQueryDto.orderParse.field]: pageQueryDto.orderParse.value };
    }

    if (pageQueryDto?.filterParse) {
      switch (pageQueryDto?.filterParse?.modify) {
        case 'like':
          select.where = {
            [pageQueryDto.filterParse.field]: Like('%' + pageQueryDto.filterParse.value + '%')
          };
          break;
        case 'in':
          const arr = pageQueryDto.filterParse.value.split(',');
          select.where = { [pageQueryDto.filterParse.field]: In(arr) };
          break;
        default:
          select.where = { [pageQueryDto.filterParse.field]: pageQueryDto.filterParse.value };
      }
    }
    if (pageQueryDto?.filterParse?.not) {
      select.where[pageQueryDto.filterParse.field] = Not(select.where[pageQueryDto.filterParse.field]);
    }

    select.skip = (pageQueryDto.pageNum - 1) * pageQueryDto.pageSize;
    select.take = pageQueryDto.pageSize;
    const [err, count] = await wrap(repository.count(select));
    if (err) {
      throw new BadRequestException(err.message);
    }
    const [_, data] = await wrap(repository.find(select));
    if (_) {
      throw new BadRequestException(_.message);
    }
    const body = {
      list: data,
      page: { num: pageQueryDto.pageNum, size: pageQueryDto.pageSize, total: Math.ceil(count / pageQueryDto.pageSize), count }
    }
    return body;
  }

  static async queryArr (arr: any[], page: PageQueryDto) {
    const pageSize = page.pageSize;
    const pageNum = (page.pageNum - 1) * pageSize;
    const len = arr.length;
    return await Promise.resolve(arr)
      .then(arr => !page.filterParse ? arr : arr.filter(item => item[page.filterParse.field] == page.filterParse.value))
      .then(arr => !page.orderParse ? arr : arr.sort((itemA, itemB) => page.orderParse.value === 'ASC' ? (itemA[page.orderParse.field] - itemB[page.orderParse.field]) : (itemB[page.orderParse.field] - itemA[page.orderParse.field])))
      .then(arr => arr.slice(pageNum, pageSize))
      .then(arr => ({
        list: arr,
        page: { num: page.pageNum, size: page.pageSize, total: len }
      }))
  }
}
