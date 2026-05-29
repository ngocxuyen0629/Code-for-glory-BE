import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type RecallSystemDocument = HydratedDocument<RecallSystem>;

@Schema({
  timestamps: true,
})
export class RecallSystem {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  })
  userId!: mongoose.Types.ObjectId;

  @Prop({
    required: true,
  })
  questionId!: number;

  @Prop({
    default: 1,
  })
  interval!: number;

  @Prop({
    default: 2.5,
  })
  easeFactor!: number;

  @Prop({
    default: 0,
  })
  repetitions!: number;

  @Prop()
  nextReviewDate!: Date;
}

export const RecallSystemSchema = SchemaFactory.createForClass(RecallSystem);
