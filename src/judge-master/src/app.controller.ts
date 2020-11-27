import { Controller, Get, Query } from '@nestjs/common';

@Controller()
export class AppController {
  @Get('accpet/judge_coder_heartbeat')
  judgeServerHeartbeat (@Query() body) {
    console.log(body)
    return {};
  }

  @Get('/')
  getApiV1 () {
    const routes: Map<any, any> = (global as any).app.routes;
    const data = [];
    routes.forEach((val, key) => {
      const types = Object.keys(val);
      types.forEach(type => {
        data.push({ protocol: 'HTTP/1.1', type: type.toUpperCase(), router: key.replace(/:(\w+)/igm, "{$1}") });
      });
    })
    return data;
  }
}
