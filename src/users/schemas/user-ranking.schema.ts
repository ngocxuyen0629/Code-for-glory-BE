import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { CareerField } from '../../common/enums';

export type UserRankingDocument = HydratedDocument<UserRanking>;

/**
 * USER_RANKING — ELO/rating per career field.
 *
 * Survey insight: 88.2% người dùng muốn matching dựa trên Rank,
 * 76.5% muốn cùng lĩnh vực (FE vs FE). Vì vậy lưu rating tách
 * theo field thay vì một con số duy nhất.
 */
@Schema({ timestamps: true })
export class UserRanking {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId!: Types.ObjectId;

  @Prop({ type: String, enum: CareerField, required: true })
  field!: CareerField;

  @Prop({ type: Number, default: 1000 })
  ratingPoints!: number; // ELO

  @Prop({ type: Number, default: 0 })
  totalBattles!: number;

  @Prop({ type: Number, default: 0 })
  wins!: number;

  @Prop({ type: Number, default: 0 })
  losses!: number;

  @Prop({ type: Number, default: 0 })
  draws!: number;

  @Prop({ type: Number, default: 0 })
  winRate!: number; // 0.0 - 1.0

  @Prop({ type: String, default: 'Bronze' })
  tier!: string; // Bronze / Silver / Gold / Archmage ...

  @Prop({ type: Number, default: 0 })
  peakRating!: number;

  @Prop({ type: Date })
  lastBattleAt?: Date;
}

export const UserRankingSchema = SchemaFactory.createForClass(UserRanking);

// One ranking row per (user, field)
UserRankingSchema.index({ userId: 1, field: 1 }, { unique: true });
// Leaderboard query
UserRankingSchema.index({ field: 1, ratingPoints: -1 });
