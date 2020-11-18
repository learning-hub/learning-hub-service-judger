import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { JudgerModule } from 'src/modules/judger/judger.module';
import { JudgerService } from 'src/modules/judger/judger.service';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [JudgerModule],
    })
      .overrideProvider(JudgerService)
      .useValue(JudgerService)
      .overridePipe(new ValidationPipe({ transform: true }))
      .useValue(ValidationPipe)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/judger/code (POST)', () => {
    return request(app.getHttpServer())
      .post('/judger/code')
      .send({ name: 'john' })
      .expect(201)
      .expect(res => {
        console.log('res :>> ', res.body);
      })
  });
});
