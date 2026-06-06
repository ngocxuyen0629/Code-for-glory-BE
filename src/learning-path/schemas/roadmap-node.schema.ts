import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { NodeType, QuestionDifficulty } from '../../common/enums';

export type RoadmapNodeDocument = HydratedDocument<RoadmapNode>;

@Schema({ _id: false })
export class NodeContent {
  @Prop({ type: String })
  theory?: string; // Markdown / HTML

  @Prop({ type: String })
  videoUrl?: string;

  @Prop({ type: [String], default: [] })
  attachments!: string[]; // file URLs

  @Prop({ type: [Types.ObjectId], ref: 'Question', default: [] })
  questionIds!: Types.ObjectId[]; // bài tập gắn trong node

  @Prop({ type: Types.ObjectId, ref: 'Exercise' })
  labExerciseId?: Types.ObjectId; // bài Lab (cho Mini-Project / Lab gate)
}

@Schema({ _id: false })
export class UnlockCondition {
  @Prop({ type: [Types.ObjectId], ref: 'RoadmapNode', default: [] })
  prerequisiteNodeIds!: Types.ObjectId[];

  @Prop({ type: Number, default: 0 })
  minScore!: number; // % required on previous node

  @Prop({ type: Boolean, default: false })
  requiresBattleWin!: boolean;
}

/**
 * ROADMAPNODES — A single node (lesson) inside a roadmap.
 */
@Schema({ timestamps: true })
export class RoadmapNode {
  @Prop({ type: Types.ObjectId, ref: 'Roadmap', required: true })
  roadmapId!: Types.ObjectId;

  @Prop({ type: Number, required: true })
  milestoneOrder!: number; // belongs to which chapter

  @Prop({ type: Number, required: true })
  order!: number; // position inside the milestone

  @Prop({ type: String, required: true })
  title!: string; // "JS Basics: Variables", "Ancient Cipher Decryption"

  @Prop({ type: String })
  description?: string;

  @Prop({ type: String, enum: NodeType, required: true })
  type!: NodeType;

  @Prop({
    type: String,
    enum: QuestionDifficulty,
    default: QuestionDifficulty.EASY,
  })
  difficulty!: QuestionDifficulty;

  @Prop({ type: NodeContent, default: () => ({}) })
  content!: NodeContent;

  @Prop({ type: UnlockCondition, default: () => ({}) })
  unlockCondition!: UnlockCondition;

  /** Estimated time to complete (minutes) — used for Timeline calc */
  @Prop({ type: Number, default: 30 })
  estimatedMinutes!: number;

  @Prop({ type: Number, default: 100 })
  rewardXp!: number;

  @Prop({ type: Number, default: 10 })
  rewardCoins!: number;

  @Prop({ type: [String], default: [] })
  tags!: string[]; // ['html', 'flexbox', 'cryptography']

  @Prop({ type: Boolean, default: true })
  isPublished!: boolean;

  @Prop({ type: String })
  thumbnailUrl?: string;
}

export const RoadmapNodeSchema = SchemaFactory.createForClass(RoadmapNode);

RoadmapNodeSchema.index({ roadmapId: 1, milestoneOrder: 1, order: 1 });
RoadmapNodeSchema.index({ tags: 1 });
