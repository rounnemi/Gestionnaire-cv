import { Controller, Get, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { AdminGuard } from './admin/admin.guard';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @UseGuards(AdminGuard)
  getAppData() {
    return 'Protected app data for admins only';
  }
}
