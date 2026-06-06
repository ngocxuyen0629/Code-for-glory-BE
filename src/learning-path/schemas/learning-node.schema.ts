import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { NodeType } from '../enums/node-type.enum';

@Schema({ _id: false })
export class Quiz {
  @Prop({ required: true })
  question!: string;

  @Prop({ type: [String], required: true })
  options!: string[];

  @Prop({ required: true, min: 0 })
  answerIndex!: number;
}

@Schema({ timestamps: true })
export class LearningNode extends Document {
  @Prop({ type: Types.ObjectId, ref: 'LearningPath', required: true })
  pathId!: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'LearningNode', default: null })
  parentId?: Types.ObjectId;

  @Prop({ type: String, enum: NodeType, required: true }) type!: NodeType;

  @Prop({ required: true }) title!: string;

  @Prop({ default: 0 }) order?: number;

  @Prop({}) theory?: string;

  @Prop({ type: [Quiz], default: [] }) quizzes?: Quiz[];

  @Prop() problemStatement?: string;

  @Prop() starterCode?: string;

  @Prop() expectedOutput?: string;
}

export const QuizSchema = SchemaFactory.createForClass(Quiz);
export const LearningNodeSchema = SchemaFactory.createForClass(LearningNode);
