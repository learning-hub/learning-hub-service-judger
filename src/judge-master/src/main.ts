import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { AppModule } from './app.module';
import { ResInterceptor } from './interceptors/res.interceptor';

async function bootstrap () {
  const fastifyAdapter = new FastifyAdapter();
  const app = await NestFactory.create<NestFastifyApplication>(AppModule, fastifyAdapter);
  app.setGlobalPrefix('/api/v1');
  // app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.useGlobalInterceptors(new ResInterceptor);
  await app.listen(3000);
  console.log(`server listening on ${await app.getUrl()}`)
  console.log(fastifyAdapter.getInstance().printRoutes())
}
bootstrap();
