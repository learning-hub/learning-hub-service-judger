import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { AppModule } from './app.module';
import { UnifyExceptionFilter } from './filters/unify-exception.filter';
import { ResInterceptor } from './interceptors/res.interceptor';

async function bootstrap () {
  const fastifyAdapter = new FastifyAdapter();
  const app = await NestFactory.create<NestFastifyApplication>(AppModule, fastifyAdapter);
  app.setGlobalPrefix('/api/v1');
  app.useGlobalInterceptors(new ResInterceptor);
  app.useGlobalFilters(new UnifyExceptionFilter);
  await app.listen(3000);
  console.log(`server listening on ${await app.getUrl()}`)
  console.log(fastifyAdapter.getInstance().printRoutes())
}
bootstrap();
