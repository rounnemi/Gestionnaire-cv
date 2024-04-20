import { IsNumber, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class GetPaginatedCvDto {
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  page: number;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  pageSize: number;
}
