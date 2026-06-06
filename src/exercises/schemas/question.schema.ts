import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import {
  CareerField,
  QuestionDifficulty,
  QuestionType,
} from '../../common/enums';

export type QuestionDocument = HydratedDocument<Question>;

@Schema({ _id: false })
export class TestCase {
  @Prop({ type: String, required: true })
  input!: string;

  @Prop({ type: String, required: true })
  expectedOutput!: string;

  @Prop({ type: Boolean, default: false })
  isHidden!: boolean; // testcase ẩn — chỉ dùng để chấm

  @Prop({ type: String })
  explanation?: string;

  @Prop({ type: Number, default: 1 })
  weight!: number;
}

@Schema({ _id: false })
export class MultipleChoiceOption {
  @Prop({ type: String, required: true })
  text!: string;

  @Prop({ type: Boolean, default: false })
  isCorrect!: boolean;

  @Prop({ type: String })
  explanation?: string;
}

@Schema({ _id: false })
export class CodeTemplate {
  @Prop({ type: String, required: true })
  language!: string; // 'python', 'javascript', 'java', ...

  @Prop({ type: String, default: '' })
  starterCode!: string;

  @Prop({ type: String })
  solution?: string; // chỉ admin/AI xem
}

/**
 * QUESTIONS — Universal question bank.
 *
 * Used by:
 *  - Quick Technical Test (Survey, 30s/câu)
 *  - Lesson quizzes
 *  - Battle questions
 *  - Recall tests (Spaced Repetition)
 */
@Schema({ timestamps: true })
export class Question {
  @Prop({ type: String, required: true })
  title!: string;

  @Prop({ type: String, required: true })
  content!: string; // problem statement (markdown)

  @Prop({ type: String, enum: QuestionType, required: true })
  type!: QuestionType;

  @Prop({ type: String, enum: QuestionDifficulty, required: true })
  difficulty!: QuestionDifficulty;

  @Prop({ type: String, enum: CareerField, required: true })
  field!: CareerField;

  @Prop({ type: [String], default: [] })
  category!: string[]; // ['array', 'hashmap', 'flexbox', ...]

  @Prop({ type: [String], default: [] })
  tags!: string[];

  // For multiple-choice
  @Prop({ type: [MultipleChoiceOption], default: [] })
  options!: MultipleChoiceOption[];

  // For coding
  @Prop({ type: [CodeTemplate], default: [] })
  templates!: CodeTemplate[];

  @Prop({ type: [TestCase], default: [] })
  testCases!: TestCase[];

  /** Time limit (giây) — survey: 30s/câu cho quick test */
  @Prop({ type: Number, default: 30 })
  timeLimitSeconds!: number;

  @Prop({ type: Number, default: 256 })
  memoryLimitMb!: number;

  @Prop({ type: String })
  explanation?: string; // shown after solved / time out

  @Prop({ type: [String], default: [] })
  hints!: string[]; // for AI mentor progressive disclosure

  @Prop({ type: Number, default: 0 })
  acceptedCount!: number;

  @Prop({ type: Number, default: 0 })
  attemptCount!: number;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  createdBy?: Types.ObjectId; // admin

  @Prop({ type: Boolean, default: true })
  isPublished!: boolean;
}

export const QuestionSchema = SchemaFactory.createForClass(Question);

QuestionSchema.index({ field: 1, difficulty: 1, type: 1 });
QuestionSchema.index({ tags: 1 });
QuestionSchema.index({ category: 1 });
