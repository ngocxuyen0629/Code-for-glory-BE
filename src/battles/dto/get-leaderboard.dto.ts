import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, Max, Min } from 'class-validator';
import { CareerField } from '../../common/enums';

export class GetLeaderboardDto {
  @IsEnum(CareerField)
  field!: CareerField;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 20;
}
