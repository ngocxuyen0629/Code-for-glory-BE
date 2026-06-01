import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsInt,
  IsMongoId,
} from 'class-validator';
import { NodeType } from '../enums/node-type.enum';

export class CreateNodeDto {
  @IsNotEmpty() @IsEnum(NodeType) type!: NodeType;

  @IsNotEmpty() @IsString() title!: string;

  @IsOptional() @IsMongoId() parentId?: string;

  @IsOptional() @IsInt() order?: number;

  @IsOptional() @IsString() theory?: string;
}
