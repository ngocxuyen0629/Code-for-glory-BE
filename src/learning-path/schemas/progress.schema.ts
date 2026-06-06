import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ProgressStatus } from '../enums/progress-status.enum';

@Schema({ timestamps: true })
export class Progress extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId!: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'LearningNode', required: true })
  nodeId!: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'LearningPath', required: true })
  pathId!: Types.ObjectId;

  @Prop({
    type: String,
    enum: ProgressStatus,
    default: ProgressStatus.NOT_STARTED,
  })
  status!: ProgressStatus;

  @Prop() quizScore?: number;
}

export const ProgressSchema = SchemaFactory.createForClass(Progress);
ProgressSchema.index({ userId: 1, nodeId: 1 }, { unique: true });
