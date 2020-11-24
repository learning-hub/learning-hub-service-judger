import { Body, Controller, Get, Post, Query } from '@nestjs/common';

@Controller()
export class AppController {
  @Get('accpet/judge_coder_heartbeat')
  judgeServerHeartbeat (@Query() body) {
    console.log(body)
    return {};
  }
}
