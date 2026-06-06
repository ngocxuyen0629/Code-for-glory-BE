import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { CareerField } from '../../common/enums';

export class CreateLearningPathDto {
  @IsNotEmpty() @IsString() title!: string;

  @IsOptional() @IsString() description?: string;

  @IsNotEmpty() @IsEnum(CareerField) field!: CareerField;
}
