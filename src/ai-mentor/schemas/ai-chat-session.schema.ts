import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { AIMentorStyle, AIMentorTone } from '../../common/enums';

export type AiChatSessionDocument = HydratedDocument<AiChatSession>;

/**
 * AI Chat Session — one conversation between a user and AI Mentor,
 * scoped to a lesson, exercise, or battle.
 *
 * Style is constrained per survey "Bị stuck thì AI hỗ trợ thế nào":
 *   52.9% — INDIRECT (chỉ đặt câu hỏi gợi mở, không cho đáp án)
 *   17.6% — STEP_BY_STEP
 *   23.5% — CONCEPT_EXPLANATION
 *    5.9% — DIRECT
 *
 * Doc cũng quy định: "AI chỉ được đưa ra gợi ý và giải thích lỗi
 * logic trong 1-2 dòng, không cung cấp code trực tiếp".
 */
@Schema({ timestamps: true })
export class AiChatSession {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId!: Types.ObjectId;

  /** Linked context — what is the user working on right now */
  @Prop({ type: Types.ObjectId, ref: 'RoadmapNode' })
  nodeId?: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Question' })
  questionId?: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Exercise' })
  exerciseId?: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Battle' })
  battleId?: Types.ObjectId;

  @Prop({ type: String, enum: AIMentorStyle, default: AIMentorStyle.INDIRECT })
  style!: AIMentorStyle;

  @Prop({ type: String, enum: AIMentorTone, default: AIMentorTone.FRIENDLY })
  tone!: AIMentorTone;

  @Prop({ type: String, default: 'gpt-4' })
  model!: string;

  @Prop({ type: Number, default: 0 })
  totalTokensUsed!: number;

  @Prop({ type: Number, default: 0 })
  messageCount!: number;

  @Prop({ type: Boolean, default: false })
  isClosed!: boolean;

  @Prop({ type: String })
  title?: string; // summary of conversation
}

export const AiChatSessionSchema = SchemaFactory.createForClass(AiChatSession);

AiChatSessionSchema.index({ userId: 1, createdAt: -1 });
AiChatSessionSchema.index({ userId: 1, nodeId: 1 });
AiChatSessionSchema.index({ userId: 1, battleId: 1 });
