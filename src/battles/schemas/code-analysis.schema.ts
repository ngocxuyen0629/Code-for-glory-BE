import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type CodeAnalysisDocument = HydratedDocument<CodeAnalysis>;

@Schema({ _id: false })
export class ComplexityAnalysis {
  @Prop({ type: String })
  timeComplexity?: string;

  @Prop({ type: String })
  spaceComplexity?: string;

  @Prop({ type: Number })
  performanceScore?: number;
}

@Schema({ _id: false })
export class CleanCodeScore {
  @Prop({ type: Number, default: 0 })
  readability!: number; // 0-100

  @Prop({ type: Number, default: 0 })
  maintainability!: number;

  @Prop({ type: Number, default: 0 })
  bestPractices!: number;

  @Prop({ type: Number, default: 0 })
  overall!: number;
}

@Schema({ timestamps: true })
export class CodeAnalysis {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId!: Types.ObjectId;

  @Prop({ type: Types.ObjectId, required: true })
  targetId!: Types.ObjectId;

  @Prop({ type: String, required: true })
  targetType!: string;

  @Prop({ type: Types.ObjectId, ref: 'Battle' })
  battleId?: Types.ObjectId;

  @Prop({ type: String, required: true })
  analysisText!: string; // full markdown review

  @Prop({ type: String })
  summary?: string; // 1-2 sentence headline

  @Prop({ type: [String], default: [] })
  strengths!: string[];

  @Prop({ type: [String], default: [] })
  improvements!: string[];

  @Prop({ type: [String], default: [] })
  suggestions!: string[];

  @Prop({ type: ComplexityAnalysis, default: () => ({}) })
  complexity!: ComplexityAnalysis;

  @Prop({ type: CleanCodeScore, default: () => ({}) })
  cleanCodeScore!: CleanCodeScore;

  @Prop({ type: String, default: 'gpt-4' })
  modelUsed!: string;

  @Prop({ type: Number, default: 0 })
  tokensUsed!: number;
}

export const CodeAnalysisSchema = SchemaFactory.createForClass(CodeAnalysis);

CodeAnalysisSchema.index({ userId: 1, createdAt: -1 });
CodeAnalysisSchema.index({ targetId: 1, targetType: 1 });
CodeAnalysisSchema.index({ battleId: 1 });
