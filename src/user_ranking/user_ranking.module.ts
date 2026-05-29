import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { UserRanking, UserRankingSchema } from './schema/user_ranking.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: UserRanking.name,
        schema: UserRankingSchema,
      },
    ]),
  ],
})
export class UserRankingModule {}
