import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class BattleSubmission extends Document {
  @Prop({ type: Types.ObjectId, ref: 'Battle', required: true })
  battleId!: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId!: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Question', required: true })
  questionId!: Types.ObjectId;

  @Prop({ required: true })
  answer!: string;

  @Prop({ required: true })
  isCorrect!: boolean;

  @Prop({ default: 0 })
  points!: number;

  @Prop()
  timeSpent?: number;

  @Prop({ default: Date.now })
  submittedAt!: Date;
}

export type BattleSubmissionsDocument = BattleSubmission & Document;

export const BattleSubmissionSchema =
  SchemaFactory.createForClass(BattleSubmission);
BattleSubmissionSchema.index({ battleId: 1, userId: 1 });
