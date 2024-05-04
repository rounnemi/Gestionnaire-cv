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
  ParseIntPipe,
  Sse,
  UseGuards,
  UnauthorizedException,
} from '@nestjs/common';
import { CvService } from './cv.service';
import { Cv } from './entities/cv.entity';
import { FilterDto } from './dto/filter.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerOptions } from 'src/middleware/file-upload.middleware';
import { GetPaginatedCvDto } from './dto/paginated-cv.dto';
import { CreateCvDto } from './dto/create-cv.dto';
import { fromEvent, map, Observable } from 'rxjs';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { AdminGuard } from 'src/admin/admin.guard';
import { Token } from 'src/token/token.decorator';
import { ExceptionsHandler } from '@nestjs/core/exceptions/exceptions-handler';
import { CvEvent } from 'src/events/cv.event';
import { CvEvents } from 'src/common/events.config';

@Controller('cv')
export class CvController {
  constructor(
    private readonly cvService: CvService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  @Sse('sse')
  sse(@Token() token): Observable<MessageEvent> {
    return fromEvent(this.eventEmitter, 'cv-event').pipe(
      map((payload: any) => {
        console.log(payload);
        if (token.userId === payload.user.id || token.role === 'admin')
          return new MessageEvent(payload.eventType, { data: payload });
      }),
    );
  }

  @Get()
  findAll(): Promise<Cv[]> {
    return this.cvService.findAll();
  }

  @Get('detail/:id')
  findOne(@Param('id', ParseIntPipe) id): Promise<Cv> {
    return this.cvService.findOne(id);
  }

  @Get('filter')
  findAllFiltered(@Query() filterDto: FilterDto): Promise<Cv[]> {
    return this.cvService.findAllFiltered(filterDto);
  }

  @Post()
  async create(
    @Body(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
    cv: CreateCvDto,
  ): Promise<Cv> {
    const cvDone = await this.cvService.create(cv);

    return cvDone;
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id,
    @Body() newData: Partial<Cv>,
  ): Promise<Cv> {
    return this.cvService.update(id, newData);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id): Promise<string> {
    return this.cvService.remove(id);
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
