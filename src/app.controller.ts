import { Controller, Get, Put, Body, Param } from '@nestjs/common';
import { AppService } from './app.service';
import {
  GameInstance,
  Network
} from './classes';
import {
  AuthenticateRequest,
  AuthenticateResponse,
  DoActionRequest,
  DoActionResponse,
  MapResponse
} from './models';

@Controller()
export class AppController {
  private readonly network: Network;
  constructor(private readonly appService: AppService) {
    this.network = GameInstance.network;
  }

  @Get('entities/:token')
  getEntities(@Param('token') token: string): MapResponse {
    return this.network.getMap(token);
  }

  @Put('authenticate')
  authenticate(@Body() request: AuthenticateRequest): AuthenticateResponse {
    return this.network.createUser(request);
  }

  @Put('do/:token')
  actions(@Param('token') token: string, @Body() request: DoActionRequest): DoActionResponse {
    return this.network.foo(token, request);
  }
}
