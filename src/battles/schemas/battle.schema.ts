import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { BattleMode } from '../enums/battle-mode.enum';
import { BattleStatus } from '../enums/battle-status.enum';
import { Field } from '../enums/field.enum';
// import { Type } from "@nestjs/common";

@Schema({ _id: false })
export class BattlePlayer {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId!: Types.ObjectId;

  @Prop({ required: true })
  username!: string;

  @Prop()
  avatar?: string;

  @Prop({ default: 0 })
  currentScore!: number;

  @Prop({ default: false })
  hasSubmitted!: boolean;

  @Prop()
  joinedAt!: Date;
}

@Schema({ _id: false })
export class BattleQuesion {
  @Prop({ type: Types.ObjectId, ref: 'Question', required: true })
  questionId!: Types.ObjectId;

  @Prop({ required: true })
  title!: string;

  @Prop({ required: true })
  content!: string;

  @Prop({ required: true })
  difficulty!: string;

  @Prop({ type: Array, default: [] })
  testCases!: any[];

  @Prop()
  correctAnswer?: string;
}

@Schema({ timestamps: true })
export class Battle extends Document {
  @Prop({ type: String, enum: BattleMode, required: true })
  mode!: BattleMode;

  @Prop({ type: String, enum: Field, required: true })
  field!: Field;

  @Prop({
    type: String,
    enum: BattleStatus,
    default: BattleStatus.WAITING,
  })
  status!: BattleStatus;

  @Prop({ type: [BattlePlayer], default: [] })
  players!: BattlePlayer[];

  @Prop({ type: [BattleQuesion], default: [] })
  questions!: BattleQuesion[];

  @Prop({ required: true })
  timeLimit!: number;

  @Prop()
  startTime?: Date;

  @Prop()
  endTime?: Date;

  @Prop()
  expectedEndTime?: Date;

  @Prop({ type: Object })
  result?: {
    winnerId?: Types.ObjectId;
    isDraw?: boolean;
    finalScores: { userId: string; score: number }[];
  };

  @Prop({ type: Types.ObjectId, ref: 'CodeAnalysis' })
  codeAnalysisId?: Types.ObjectId;
}
export type BattleDocument = Battle & Document;

export const BattleSchema = SchemaFactory.createForClass(Battle);

BattleSchema.index({ status: 1, mode: 1, field: 1 });
BattleSchema.index({ 'players.userId': 1 });
