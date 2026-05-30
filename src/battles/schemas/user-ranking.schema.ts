// src/battles/schemas/user-ranking.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Field } from '../enums/field.enum';

@Schema({ timestamps: true })
export class UserRanking extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId!: Types.ObjectId;

  @Prop({ type: String, enum: Field, required: true })
  field!: Field;

  @Prop({ default: 1000 })
  ratingPoints!: number;

  @Prop({ default: 0 })
  totalBattles!: number;

  @Prop({ default: 0 })
  wins!: number;

  @Prop({ default: 0 })
  losses!: number;

  @Prop({ default: 0 })
  draws!: number;

  @Prop({ default: 0 })
  winRate!: number;
}

export type UserRankingDocument = UserRanking & Document;

export const UserRankingSchema = SchemaFactory.createForClass(UserRanking);

// Compound unique index: 1 user chỉ có 1 ranking cho mỗi field
UserRankingSchema.index({ userId: 1, field: 1 }, { unique: true });

// Index cho leaderboard query (sort theo điểm giảm dần)
UserRankingSchema.index({ field: 1, ratingPoints: -1 });
