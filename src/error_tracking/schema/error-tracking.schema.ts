import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type ErrorTrackingDocument = HydratedDocument<ErrorTracking>;

@Schema({
  timestamps: true,
})
export class ErrorTracking {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  })
  userId!: mongoose.Types.ObjectId;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Question',
    required: true,
  })
  questionId!: mongoose.Types.ObjectId;

  @Prop({
    enum: ['syntax', 'logic', 'runtime'],
  })
  errorType!: string;

  @Prop({
    default: 0,
  })
  failCount!: number;

  @Prop()
  submittedCode!: string;

  @Prop()
  aiFeedbackId!: number;
}

export const ErrorTrackingSchema = SchemaFactory.createForClass(ErrorTracking);
