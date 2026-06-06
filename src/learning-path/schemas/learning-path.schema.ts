import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Field } from '../enums/field.enum';

@Schema({ timestamps: true })
export class LearningPath extends Document {
  @Prop({ type: String, required: true }) title!: string;

  @Prop({}) description?: string;

  @Prop({ type: String, required: true, enum: Field }) field!: Field;
}

export const LearningPathSchema = SchemaFactory.createForClass(LearningPath);
