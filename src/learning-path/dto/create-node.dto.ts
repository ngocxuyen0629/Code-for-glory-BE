import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsInt,
  IsMongoId,
  IsArray,
  IsNumber,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { NodeType } from '../enums/node-type.enum';

export class QuizDto {
  @IsNotEmpty() @IsString() question!: string;

  @IsArray() @IsString({ each: true }) options!: string[];

  @IsNumber() @Min(0) answerIndex!: number;
}
export class CreateNodeDto {
  @IsNotEmpty() @IsEnum(NodeType) type!: NodeType;

  @IsNotEmpty() @IsString() title!: string;

  @IsOptional() @IsMongoId() parentId?: string;

  @IsOptional() @IsInt() order?: number;

  @IsOptional() @IsString() theory?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => QuizDto)
  quizzes?: QuizDto[];

  @IsOptional() @IsString() problemStatement?: string;

  @IsOptional() @IsString() starterCode?: string;

  @IsOptional() @IsString() expectedOutput?: string;
}
