import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateCvDto {
  @IsString()
  @IsNotEmpty()
  name: string;
  @IsString()
  @IsNotEmpty()
  firstname: string;
  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  age: number;
  @IsString()
  @IsNotEmpty()
  Cin: string;
  @IsString()
  @IsOptional()
  Job: string;
  @IsNotEmpty()
  @Type(() => Number)
  userID: number;

  @IsNotEmpty()
  skillsId: number[];
}
