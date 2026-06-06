import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { CareerField, LessonLevel } from '../../common/enums';

export type RoadmapDocument = HydratedDocument<Roadmap>;

@Schema({ _id: false })
export class Milestone {
  @Prop({ type: String, required: true })
  title!: string; // "Chapter 1: The Foundation"

  @Prop({ type: String })
  description?: string;

  @Prop({ type: Number, required: true })
  order!: number; // chapter index

  @Prop({ type: [Types.ObjectId], ref: 'RoadmapNode', default: [] })
  nodeIds!: Types.ObjectId[];

  /** Cuối milestone: 'battle' hay 'project' — bám sát Survey "Phân đoạn 3" */
  @Prop({ type: String, default: 'project' })
  gateType!: string;

  @Prop({ type: Number, default: 0 })
  rewardXp!: number;

  @Prop({ type: Number, default: 0 })
  rewardCoins!: number;
}

/**
 * ROADMAPS — Master roadmap definition (FE / BE / Fullstack).
 * Generated once by admin, then USER_PROGRESS tracks each user
 * against this template.
 */
@Schema({ timestamps: true })
export class Roadmap {
  @Prop({ type: String, required: true })
  title!: string; // "Roadmap Frontend Senior trong 6 tháng"

  @Prop({ type: String })
  description?: string;

  @Prop({ type: String, enum: CareerField, required: true })
  field!: CareerField;

  @Prop({ type: String, enum: LessonLevel, required: true })
  level!: LessonLevel;

  @Prop({ type: [Milestone], default: [] })
  milestones!: Milestone[];

  @Prop({ type: Number, default: 0 })
  totalLessons!: number;

  @Prop({ type: Number, default: 0 })
  totalEstimatedHours!: number;

  @Prop({ type: Boolean, default: true })
  isActive!: boolean;

  @Prop({ type: String })
  thumbnailUrl?: string;

  @Prop({ type: Number, default: 1 })
  version!: number;
}

export const RoadmapSchema = SchemaFactory.createForClass(Roadmap);

RoadmapSchema.index({ field: 1, level: 1, isActive: 1 });
