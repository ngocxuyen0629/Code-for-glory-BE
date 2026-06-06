import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import {
  CareerField,
  QuestionDifficulty,
  QuestionType,
} from '../../common/enums';

export type ExerciseDocument = HydratedDocument<Exercise>;

/**
 * Exercise — larger Lab / Mini-Project assignments
 * (52.9% người dùng prefer Lab thực hành để mở khoá chặng tiếp theo).
 *
 * Khác Question:
 *   - Có thể nhiều file/folder (project structure)
 *   - Time-limit dài hơn (giờ thay vì giây)
 *   - Có thể có prerequisite exercises
 */
@Schema({ _id: false })
export class StarterFile {
  @Prop({ type: String, required: true })
  path!: string;

  @Prop({ type: String, default: '' })
  content!: string;

  @Prop({ type: String })
  language?: string;

  @Prop({ type: Boolean, default: false })
  readOnly!: boolean;
}

@Schema({ _id: false })
export class GradingCriterion {
  @Prop({ type: String, required: true })
  name!: string;

  @Prop({ type: String })
  description?: string;

  @Prop({ type: Number, required: true })
  weight!: number;

  @Prop({ type: String, default: 'auto' })
  type!: string; // 'auto' (testcase) | 'ai' (AI mentor) | 'manual'
}

@Schema({ timestamps: true })
export class Exercise {
  @Prop({ type: String, required: true })
  title!: string;

  @Prop({ type: String, required: true })
  description!: string;

  @Prop({ type: String, enum: QuestionType, required: true })
  type!: QuestionType; // LAB | MINI_PROJECT

  @Prop({ type: String, enum: QuestionDifficulty, required: true })
  difficulty!: QuestionDifficulty;

  @Prop({ type: String, enum: CareerField, required: true })
  field!: CareerField;

  @Prop({ type: [String], default: [] })
  category!: string[];

  @Prop({ type: [Types.ObjectId], ref: 'Exercise', default: [] })
  prerequisiteIds!: Types.ObjectId[];

  @Prop({ type: [StarterFile], default: [] })
  starterFiles!: StarterFile[];

  @Prop({ type: [GradingCriterion], default: [] })
  gradingCriteria!: GradingCriterion[];

  /** Đáp án/solution mở khoá sau bao nhiêu phút — survey: 10/20/30p */
  @Prop({ type: Number, default: 30 })
  solutionUnlockMinutes!: number;

  @Prop({ type: String })
  solutionCode?: string;

  @Prop({ type: String })
  solutionExplanation?: string;

  @Prop({ type: [String], default: [] })
  hints!: string[];

  @Prop({ type: Number, default: 120 })
  estimatedMinutes!: number;

  @Prop({ type: Number, default: 500 })
  rewardXp!: number;

  @Prop({ type: Number, default: 50 })
  rewardCoins!: number;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  createdBy?: Types.ObjectId;

  @Prop({ type: Boolean, default: true })
  isPublished!: boolean;
}

export const ExerciseSchema = SchemaFactory.createForClass(Exercise);

ExerciseSchema.index({ field: 1, difficulty: 1 });
ExerciseSchema.index({ category: 1 });
