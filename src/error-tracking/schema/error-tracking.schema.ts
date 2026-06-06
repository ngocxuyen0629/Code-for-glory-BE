import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type ErrorTrackingDocument = HydratedDocument<ErrorTracking>;

@Schema({ _id: false })
export class ErrorPatternStat {
  @Prop({ type: String, required: true })
  category!: string; // 'syntax' | 'logic' | 'performance' | 'security' | 'memory' | ...

  @Prop({ type: Number, default: 0 })
  count!: number;

  @Prop({ type: Number, default: 0 })
  severity!: number; // 0-10
}

@Schema({ timestamps: true })
export class ErrorTracking {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId!: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Question' })
  questionId?: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Exercise' })
  exerciseId?: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'RoadmapNode' })
  nodeId?: Types.ObjectId;

  @Prop({ type: String, required: true })
  errorType!: string;

  @Prop({ type: String })
  errorMessage?: string;

  @Prop({ type: String })
  errorTrace?: string;

  @Prop({ type: Number, default: 1 })
  failCount!: number;

  @Prop({ type: Number, default: 0 })
  submissionCount!: number;

  @Prop({ type: [ErrorPatternStat], default: [] })
  patterns!: ErrorPatternStat[];

  @Prop({ type: Types.ObjectId, ref: 'AiChatMessage' })
  aiFeedbackId?: Types.ObjectId;

  @Prop({ type: Boolean, default: false })
  resolved!: boolean;

  @Prop({ type: Date })
  resolvedAt?: Date;

  /** Suggested recovery — link to a recall test or extra lesson */
  @Prop({ type: Types.ObjectId, ref: 'RoadmapNode' })
  suggestedRecoveryNodeId?: Types.ObjectId;
}

export const ErrorTrackingSchema = SchemaFactory.createForClass(ErrorTracking);

ErrorTrackingSchema.index({ userId: 1, createdAt: -1 });
ErrorTrackingSchema.index({ userId: 1, errorType: 1 });
ErrorTrackingSchema.index({ userId: 1, resolved: 1 });
ErrorTrackingSchema.index({ userId: 1, questionId: 1 });
