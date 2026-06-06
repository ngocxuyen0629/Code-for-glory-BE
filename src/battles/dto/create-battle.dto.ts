import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { BattleMode } from '../enums/battle-mode.enum';
import { Field } from '../enums/field.enum';

export class CreateBattleDto {
  @IsNotEmpty()
  @IsEnum(BattleMode, {
    message: 'mode must be SPEED or PERFORMANCE',
  })
  mode!: BattleMode;

  @IsNotEmpty()
  @IsEnum(Field, {
    message: 'field must be FE or BE',
  })
  field!: Field;

  @IsOptional()
  @IsString()
  opponentId?: string;
}
