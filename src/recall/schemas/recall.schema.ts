import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type RecallDocument = HydratedDocument<Recall>;

/**
 * RECALL_SYSTEM — Spaced Repetition (SM-2 style) per (user, question).
 *
 * Survey: 52.9% người dùng muốn hệ thống tự tính chu kỳ ôn tập,
 * 47.1% muốn tự thiết lập.
 *
 * Fields mirror SuperMemo's SM-2:
 *   interval     — số ngày cho lần ôn tiếp theo
 *   easeFactor   — hệ số dễ (default 2.5, không nhỏ hơn 1.3)
 *   repetitions  — số lần ôn liên tiếp đúng
 *   nextReviewDate — ngày sẽ nhắc người dùng
 */
@Schema({ timestamps: true })
export class Recall {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId!: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Question' })
  questionId?: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'RoadmapNode' })
  nodeId?: Types.ObjectId;

  @Prop({ type: Number, default: 1 })
  interval!: number; // days

  @Prop({ type: Number, default: 2.5 })
  easeFactor!: number;

  @Prop({ type: Number, default: 0 })
  repetitions!: number;

  @Prop({ type: Date, required: true })
  nextReviewDate!: Date;

  @Prop({ type: Date })
  lastReviewedAt?: Date;

  @Prop({ type: Number, default: 0 })
  lastQuality!: number; // 0-5 score from last recall

  /** User-overridable cycle — 'auto' (SM-2) or 'manual' (custom days) */
  @Prop({ type: String, default: 'auto' })
  mode!: string;

  @Prop({ type: [Number], default: [] })
  customIntervals?: number[]; // manual mode: [3, 7, 14, 30]
}

export const RecallSchema = SchemaFactory.createForClass(Recall);

RecallSchema.index({ userId: 1, nextReviewDate: 1 });
RecallSchema.index({ userId: 1, questionId: 1 }, { sparse: true });
