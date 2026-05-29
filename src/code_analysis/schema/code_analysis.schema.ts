import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type CodeAnalysisDocument = HydratedDocument<CodeAnalysis>;

@Schema({
  timestamps: true,
})
export class CodeAnalysis {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  })
  userId!: mongoose.Types.ObjectId;

  @Prop({
    required: true,
  })
  targetId!: number;

  @Prop({
    enum: ['debug', 'code_review', 'roadmap_generation'],
  })
  analysisType!: string;

  @Prop()
  summary!: string;

  @Prop()
  strengths!: string;

  @Prop()
  improvements!: string;

  @Prop({
    default: false,
  })
  cleanCodeScore!: boolean;

  @Prop({
    default: [],
    type: [String],
  })
  suggestionJson!: string[];
}

export const CodeAnalysisSchema = SchemaFactory.createForClass(CodeAnalysis);
