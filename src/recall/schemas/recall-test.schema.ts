import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type RecallTestDocument = HydratedDocument<RecallTest>;

@Schema({ _id: false })
export class RecallAnswer {
  @Prop({ type: Types.ObjectId, ref: 'Question', required: true })
  questionId!: Types.ObjectId;

  @Prop({ type: String })
  userAnswer?: string;

  @Prop({ type: Boolean, default: false })
  isCorrect!: boolean;

  @Prop({ type: Number })
  timeSpentSeconds?: number;
}

/**
 * RecallTest — Quick recall quiz dùng để mở lại bài bị penalty-lock.
 *
 * Logic theo doc (page 18):
 *   - Lấy ngẫu nhiên 10 câu trắc nghiệm từ các bài đã học trước đó
 *   - Đúng 3/3 → reset Submit_Count = 0, mở bài ngay
 *   - Sai → cộng thêm 5 phút vào thời gian khoá
 */
@Schema({ timestamps: true })
export class RecallTest {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId!: Types.ObjectId;

  /** The node currently locked — passing this test unlocks it */
  @Prop({ type: Types.ObjectId, ref: 'RoadmapNode', required: true })
  lockedNodeId!: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Penalty' })
  penaltyId?: Types.ObjectId;

  @Prop({ type: [Types.ObjectId], ref: 'Question', default: [] })
  questionIds!: Types.ObjectId[];

  @Prop({ type: [RecallAnswer], default: [] })
  answers!: RecallAnswer[];

  @Prop({ type: Number, default: 0 })
  correctCount!: number;

  @Prop({ type: Number, default: 10 })
  totalCount!: number;

  @Prop({ type: Number, default: 3 })
  passingScore!: number; // need 3 correct to pass

  @Prop({ type: Boolean, default: false })
  isPassed!: boolean;

  @Prop({ type: Boolean, default: false })
  isCompleted!: boolean;

  @Prop({ type: Date })
  startedAt?: Date;

  @Prop({ type: Date })
  completedAt?: Date;

  /** Phạt thêm nếu fail — minutes added to lock duration */
  @Prop({ type: Number, default: 0 })
  extraLockMinutes!: number;
}

export const RecallTestSchema = SchemaFactory.createForClass(RecallTest);

RecallTestSchema.index({ userId: 1, createdAt: -1 });
RecallTestSchema.index({ userId: 1, lockedNodeId: 1 });
