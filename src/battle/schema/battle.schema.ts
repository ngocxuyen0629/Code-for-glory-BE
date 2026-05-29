import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type BattleDocument = HydratedDocument<Battle>;

@Schema({
  timestamps: true,
})
export class Battle {
  @Prop({
    enum: ['speed', 'performance'],
  })
  mode!: string;

  @Prop({
    enum: ['waiting', 'in_progress', 'completed', 'abandoned'],
    default: 'waiting',
  })
  status!: string;

  @Prop({
    type: [Object],
    default: [],
  })
  players!: {
    userId: string;
    status: string;
    currentScore: number;
  }[];

  @Prop({
    type: [String],
    default: [],
  })
  questions!: string[];

  @Prop()
  startTime!: Date;

  @Prop()
  endTime!: Date;
}

export const BattleSchema = SchemaFactory.createForClass(Battle);
