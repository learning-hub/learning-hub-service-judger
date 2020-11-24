export type Sort = 'ASC' | 'DESC'

export type Modify = 'default' | 'like' | 'in'

export class OrderParse {
  field = 'id';

  value: Sort = 'DESC';
}

export class FilterParse {
  field?: string;

  value?: string;

  modify?: Modify = 'default';
}

export class PageQueryDto {
  pageNum?: number;

  pageSize?: number;

  order?: string;

  filter?: string;

  orderParse?: OrderParse;

  filterParse?: FilterParse;
}