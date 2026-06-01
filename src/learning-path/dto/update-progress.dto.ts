import { IsEnum, IsNotEmpty, IsOptional, IsNumber, Min } from 'class-validator';
import { ProgressStatus } from '../enums/progress-status.enum';

export class UpdateProgressDto {
  @IsNotEmpty() @IsEnum(ProgressStatus) status!: ProgressStatus;

  @IsOptional() @IsNumber() @Min(0) quizScore?: number;
}
