import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { SubmissionStatus } from '../../common/enums';

export type BattleSubmissionDocument = HydratedDocument<BattleSubmission>;

/**
 * BattleSubmission — every code submit during a battle.
 *
 * Kept separate from the generic Submission collection because
 * battles have extra constraints (timer, opponent visibility,
 * point-deduction-on-wrong-submit) and we want efficient queries
 * scoped to a single battle.
 */
@Schema({ timestamps: true })
export class BattleSubmission {
  @Prop({ type: Types.ObjectId, ref: 'Battle', required: true })
  battleId!: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId!: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Question', required: true })
  questionId!: Types.ObjectId;

  @Prop({ type: String, required: true })
  language!: string;

  @Prop({ type: String, required: true })
  code!: string;

  @Prop({ type: String, enum: SubmissionStatus, required: true })
  status!: SubmissionStatus;

  @Prop({ type: Number, default: 0 })
  passedTestCount!: number;

  @Prop({ type: Number, default: 0 })
  totalTestCount!: number;

  @Prop({ type: Number })
  runtimeMs?: number;

  @Prop({ type: Number })
  memoryKb?: number;

  /** Điểm nhận được (hoặc bị trừ — point deduction on wrong submit) */
  @Prop({ type: Number, default: 0 })
  pointsEarned!: number;

  /** Thời gian từ khi battle bắt đầu đến lúc submit (giây) */
  @Prop({ type: Number, default: 0 })
  elapsedSeconds!: number;

  @Prop({ type: Boolean, default: false })
  isFinalAnswer!: boolean;
}

export const BattleSubmissionSchema =
  SchemaFactory.createForClass(BattleSubmission);

BattleSubmissionSchema.index({ battleId: 1, userId: 1, createdAt: 1 });
BattleSubmissionSchema.index({ battleId: 1, questionId: 1 });
