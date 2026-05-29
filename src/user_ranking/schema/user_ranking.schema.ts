import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type UserRankingDocument = HydratedDocument<UserRanking>;

@Schema({
  timestamps: true,
})
export class UserRanking {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  })
  userId!: mongoose.Types.ObjectId;

  @Prop()
  field!: string;

  @Prop({
    default: 0,
  })
  ratingPoints!: number;

  @Prop({
    default: 0,
  })
  totalBattles!: number;

  @Prop({
    default: 0,
  })
  wins!: number;

  @Prop({
    default: 0,
  })
  winRate!: number;
}

export const UserRankingSchema = SchemaFactory.createForClass(UserRanking);
