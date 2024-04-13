import {
  Controller,
  Post,
  Body,
  Param,
  Put,
  Delete,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { CvService } from './cv.service';
import { Cv } from './entities/cv.entity';
import { Token } from 'src/token/token.decorator';
@Controller('cv/v2')
export class CvControllerV2 {
  constructor(private readonly cvService: CvService) {}
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
