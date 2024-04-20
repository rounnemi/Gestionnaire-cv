// src/controllers/cv.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
  Query,
  UseInterceptors,
  UploadedFile,
  ValidationPipe,
} from '@nestjs/common';
import { CvService } from './cv.service';
import { Cv } from './entities/cv.entity';
import { FilterDto } from './dto/filter.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerOptions } from 'src/middleware/file-upload.middleware';
import { GetPaginatedCvDto } from './dto/paginated-cv.dto';

@Controller('cv')
export class CvController {
  constructor(private readonly cvService: CvService) {}

  @Get()
  findAll(): Promise<Cv[]> {
    return this.cvService.findAll();
  }

  @Get('detail/:id')
  findOne(@Param('id') id: string): Promise<Cv> {
    return this.cvService.findOne(+id);
  }

  @Get('filter')
  findAllFiltered(@Query() filterDto: FilterDto): Promise<Cv[]> {
    return this.cvService.findAllFiltered(filterDto);
  }

  @Post()
  create(@Body() cv: Cv): Promise<Cv> {
    return this.cvService.create(cv);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() newData: Partial<Cv>): Promise<Cv> {
    return this.cvService.update(+id, newData);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<string> {
    return this.cvService.remove(+id);
  }

  @Get('all')
  async getAll(
    @Query(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
    mesQueryParams: GetPaginatedCvDto,
  ): Promise<Cv[]> {
    const { page = 1, pageSize = 10 } = mesQueryParams;
    return this.cvService.findAllPaginated(page, pageSize);
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file', multerOptions))
  async uploadFile(@UploadedFile() file, @Body('cvId') cvId: number) {
    const existingCv = await this.cvService.findOneByIdAndSelect(cvId);
    existingCv.path = file.path;
    await this.cvService.update(existingCv.id, existingCv);
    return { filename: file.filename };
  }
}
