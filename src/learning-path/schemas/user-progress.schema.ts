import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { NodeStatus } from '../../common/enums';

export type UserProgressDocument = HydratedDocument<UserProgress>;

/**
 * USER_PROGRESS — One row per (user, roadmapNode).
 *
 * Tracks lesson state for the colour logic on the Skill Tree:
 *   Gray  = LOCKED
 *   Blue  = CURRENT (with pulse animation)
 *   Green = COMPLETED
 *   Faded = SKIPPED (survey insight: thích "làm mờ" hơn "ẩn hoàn toàn")
 */
@Schema({ timestamps: true })
export class UserProgress {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId!: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Roadmap', required: true })
  roadmapId!: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'RoadmapNode', required: true })
  nodeId!: Types.ObjectId;

  @Prop({ type: String, enum: NodeStatus, default: NodeStatus.LOCKED })
  status!: NodeStatus;

  @Prop({ type: Number, default: 0 })
  score!: number; // best score (%) on this node

  @Prop({ type: Number, default: 0 })
  attemptCount!: number;

  @Prop({ type: Number, default: 0 })
  submitCount!: number; // số lần submit (dùng cho lock logic >= 10)

  @Prop({ type: Number, default: 0 })
  wrongCount!: number; // số lần sai liên tiếp

  @Prop({ type: Date })
  startedAt?: Date;

  @Prop({ type: Date })
  completedAt?: Date;

  @Prop({ type: Date })
  lastAttemptAt?: Date;

  /** Deadline đề xuất cho node, tính từ time_commitment của user */
  @Prop({ type: Date })
  expectedCompletionDate?: Date;

  /** Nếu status = TEMP_LOCKED, khoá đến thời điểm này */
  @Prop({ type: Date })
  lockedUntil?: Date;

  /** Thời gian thực sự đã dành cho node (giây) */
  @Prop({ type: Number, default: 0 })
  timeSpentSeconds!: number;

  /** Bookmark trong History → "Bài đã lưu" */
  @Prop({ type: Boolean, default: false })
  bookmarked!: boolean;
}

export const UserProgressSchema = SchemaFactory.createForClass(UserProgress);

// Each user has one progress row per node
UserProgressSchema.index({ userId: 1, nodeId: 1 }, { unique: true });
UserProgressSchema.index({ userId: 1, status: 1 });
UserProgressSchema.index({ userId: 1, roadmapId: 1 });
UserProgressSchema.index({ userId: 1, bookmarked: 1 });
