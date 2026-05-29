import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type UserProgressDocument = HydratedDocument<UserProgress>;

@Schema({
  timestamps: true,
})
export class UserProgress {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  })
  userId!: mongoose.Types.ObjectId;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'RoadmapNode',
    required: true,
  })
  nodeId!: mongoose.Types.ObjectId;

  @Prop({
    enum: ['locked', 'in_progress', 'completed', 'backtrack'],
    default: 'locked',
  })
  status!: string;

  @Prop({
    default: 0,
  })
  score!: number;

  @Prop()
  lastAttempt!: Date;
}

export const UserProgressSchema = SchemaFactory.createForClass(UserProgress);
