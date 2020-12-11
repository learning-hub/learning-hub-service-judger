import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { AppModule } from './app.module';
import { UnifyExceptionFilter } from './filters/unify-exception.filter';
import { ResInterceptor } from './interceptors/res.interceptor';
import * as fastifyRoutes from 'fastify-routes'

async function bootstrap () {
  const fastifyAdapter = new FastifyAdapter();
  const app = await NestFactory.create<NestFastifyApplication>(AppModule, fastifyAdapter);
  await app.register(fastifyRoutes);
  app.setGlobalPrefix('/judger/api/v1');
  app.useGlobalInterceptors(new ResInterceptor);
  app.useGlobalFilters(new UnifyExceptionFilter);
  await app.listen(Number(process.env.POST), '0.0.0.0');
  console.log(`server listening on ${await app.getUrl()}`)
  console.log(fastifyAdapter.getInstance().printRoutes());
  (global as any).app = {};
  (global as any).app.routes = (fastifyAdapter.getInstance() as any).routes;
}
bootstrap();
