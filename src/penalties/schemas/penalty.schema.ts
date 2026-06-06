import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { PenaltyType } from '../../common/enums';

export type PenaltyDocument = HydratedDocument<Penalty>;

/**
 * PENALTIES — Live quota / cooldown / lock state per
 *             (user, question or node).
 *
 * Matches the submission logic from page 17 of the doc:
 *   Lần 1-3 sai: thông báo + AI hint
 *   Lần 4-9   : cooldown 30s, nút Submit disabled
 *   Lần 10    : LOCKED — phải làm Recall Test hoặc đợi 30 phút
 */
@Schema({ timestamps: true })
export class Penalty {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId!: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Question' })
  questionId?: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Exercise' })
  exerciseId?: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'RoadmapNode' })
  nodeId?: Types.ObjectId;

  @Prop({ type: String, enum: PenaltyType, required: true })
  type!: PenaltyType;

  /** Số lần submit còn lại trước khi bị khoá */
  @Prop({ type: Number, default: 10 })
  quotaRemaining!: number;

  /** Tổng quota gốc — 10 (Light) hoặc 5 (Strict) */
  @Prop({ type: Number, default: 10 })
  quotaMax!: number;

  /** Khi cooldown vẫn còn (lần 4-9 sai → 30s) */
  @Prop({ type: Date })
  cooldownUntil?: Date;

  /** Khi bị lock hoàn toàn (lần 10 sai → 30 phút hoặc Recall Test) */
  @Prop({ type: Date })
  lockUntil?: Date;

  @Prop({ type: Boolean, default: false })
  isLocked!: boolean;

  @Prop({ type: Number, default: 0 })
  consecutiveFailures!: number;

  /** Số lần Recall Test đã làm để reset quota */
  @Prop({ type: Number, default: 0 })
  recallResetCount!: number;

  /** Phù hợp với "Special Test" — bài kiểm tra đặc biệt khi ≥5 lỗi */
  @Prop({ type: Boolean, default: false })
  specialTestAvailable!: boolean;

  @Prop({ type: Types.ObjectId, ref: 'RecallTest' })
  activeRecallTestId?: Types.ObjectId;
}

export const PenaltySchema = SchemaFactory.createForClass(Penalty);

// One penalty row per (user, target)
PenaltySchema.index({ userId: 1, questionId: 1 }, { sparse: true });
PenaltySchema.index({ userId: 1, exerciseId: 1 }, { sparse: true });
PenaltySchema.index({ userId: 1, nodeId: 1 }, { sparse: true });
PenaltySchema.index({ userId: 1, isLocked: 1 });
