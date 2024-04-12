import { IsString, IsOptional, IsNumber } from 'class-validator';
export class FilterDto {
  @IsOptional()
  @IsString()
  query: string;

  @IsOptional()
  @IsNumber()
  age: number;
}
