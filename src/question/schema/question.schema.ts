import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type QuestionDocument = HydratedDocument<Question>;

@Schema({
  timestamps: true,
})
export class Question {
  @Prop({
    required: true,
  })
  title!: string;

  @Prop({
    required: true,
  })
  content!: string;

  @Prop({
    enum: ['easy', 'medium', 'hard'],
    required: true,
  })
  difficulty!: string;

  @Prop()
  category!: string;

  @Prop()
  template!: string;

  @Prop()
  testCase!: string;

  @Prop()
  explanation!: string;
}

export const QuestionSchema = SchemaFactory.createForClass(Question);
