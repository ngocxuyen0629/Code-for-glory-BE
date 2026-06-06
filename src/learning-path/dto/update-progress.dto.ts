import { IsEnum, IsNotEmpty, IsOptional, IsNumber, Min } from 'class-validator';
import { NodeStatus } from '../../common/enums';

export class UpdateProgressDto {
  @IsNotEmpty() @IsEnum(NodeStatus) status!: NodeStatus;

  @IsOptional() @IsNumber() @Min(0) quizScore?: number;
}
