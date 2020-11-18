import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export class ResPageBody {
  num: number;
  size: number;
  total: number;
}

export interface Response<T> {
  data: T;
  errcode: number,
  page?: ResPageBody;
}

@Injectable()
export class ResInterceptor<T> implements NestInterceptor<T, Response<T>> {
  intercept (context: ExecutionContext, next: CallHandler): Observable<Response<T>> {
    return next.handle().pipe(map(data => {
      if (data?.page) {
        return { data: data.list, errcode: 0, page: data.page };
      }
      return { data: data, errcode: 0 };
    }));
  }
}