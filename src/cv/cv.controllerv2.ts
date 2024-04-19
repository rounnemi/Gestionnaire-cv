import {
  Controller,
  Post,
  Body,
  Param,
  Put,
  Delete,
  UnauthorizedException,
  NotFoundException,
  Get,
  UseGuards,
} from '@nestjs/common';
import { CvService } from './cv.service';
import { Cv } from './entities/cv.entity';
import { Token } from 'src/token/token.decorator';
import { AdminGuard } from 'src/admin/admin.guard';

@Controller('cv/v2')
export class CvControllerV2 {
  constructor(private readonly cvService: CvService) {}

  @Get()
  @UseGuards(AdminGuard)
  async findAll(): Promise<Cv[]> {
    return this.cvService.findAll();
  }

  @Get('detail/:id')
  async findOne(@Param('id') id: string, @Token() token): Promise<Cv> {
    const cv = await this.cvService.findOne(+id);
    if (!cv) {
      throw new NotFoundException('CV not found');
    }
    // Check if the user is an admin or the owner of the CV
    if (token.role === 'admin' || token.userId === cv.user.id) {
      return cv;
    } else {
      throw new UnauthorizedException(
        'Unauthorized: User does not have permission to access this CV',
      );
    }
  }

  @Post()
  create(@Body() cv: Cv, @Token() token): Promise<Cv> {
    if (!cv.user || !cv.user.id) {
      throw new Error('User information is missing for the CV');
    }
    if (token.userId !== cv.user.id) {
      throw new UnauthorizedException(
        'Unauthorized: User does not have permission to create this CV',
      );
    }
    return this.cvService.create(cv);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() newData: Partial<Cv>,
    @Token() token,
  ): Promise<Cv> {
    const cv = await this.cvService.findOne(+id);
    if (!cv) {
      throw new NotFoundException('CV not found');
    }
    if (!cv.user || !cv.user.id) {
      throw new Error('User information is missing for the CV');
    }
    if (token.userId !== cv.user.id) {
      throw new UnauthorizedException(
        'Unauthorized: User does not have permission to update this CV',
      );
    }
    return this.cvService.update(+id, newData);
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Token() token): Promise<string> {
    const cv = await this.cvService.findOne(+id);
    if (!cv) {
      throw new NotFoundException('CV not found');
    }
    if (!cv.user || !cv.user.id) {
      throw new Error('User information is missing for the CV');
    }
    if (token.userId !== cv.user.id) {
      throw new UnauthorizedException(
        'Unauthorized: User does not have permission to delete this CV',
      );
    }

    return this.cvService.remove(+id);
  }
}
