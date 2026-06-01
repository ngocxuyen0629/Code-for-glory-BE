import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose'; // ← add Types
import { NodeType } from '../enums/node-type.enum'; // ← your node-type enum

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
}

export const LearningNodeSchema = SchemaFactory.createForClass(LearningNode);
