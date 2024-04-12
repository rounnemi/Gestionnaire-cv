import { PartialType } from '@nestjs/mapped-types';
import { CreateCvDto } from './create-cv.dto';

export class UpdateCvDto extends PartialType(CreateCvDto) {}
