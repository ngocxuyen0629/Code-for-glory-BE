import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Field } from '../enums/field.enum';

export class CreateLearningPathDto {
  @IsNotEmpty() @IsString() title!: string;

  @IsOptional() @IsString() description?: string;

  @IsNotEmpty() @IsEnum(Field) field!: Field;
}
