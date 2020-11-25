import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';

@Catch(HttpException)
export class UnifyExceptionFilter implements ExceptionFilter {
  catch (exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    const status = exception.getStatus();
    if (status < 500) {
      response
        .status(status)
        .send({
          errcode: status,
          errmsg: exception.message,
          timestamp: new Date().toISOString(),
          path: request.url,
        });
    } else {
      response
        .send({
          errcode: status,
          errmsg: exception.message,
          timestamp: new Date().toISOString(),
          path: request.url,
        });
    }
  }
}