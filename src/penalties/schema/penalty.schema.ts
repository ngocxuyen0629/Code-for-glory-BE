import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type PenaltyDocument = HydratedDocument<Penalty>;

@Schema({
  timestamps: true,
})
export class Penalty {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  })
  userId!: mongoose.Types.ObjectId;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Question',
    required: true,
  })
  questionId!: mongoose.Types.ObjectId;

  @Prop({
    default: 0,
  })
  quotaRemaining!: number;

  @Prop()
  cooldownUntil!: Date;

  @Prop()
  lockUntil!: Date;
}

export const PenaltySchema = SchemaFactory.createForClass(Penalty);
