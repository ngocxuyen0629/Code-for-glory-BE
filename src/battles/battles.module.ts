import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { BattlesController } from './battles.controller';
import { BattlesService } from './battles.service';

import { Battle, BattleSchema } from './schemas/battle.schema';
import {
  BattleSubmission,
  BattleSubmissionSchema,
} from './schemas/battle-submission.schema';
import { UserRanking, UserRankingSchema } from './schemas/user-ranking.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Battle.name, schema: BattleSchema },
      { name: BattleSubmission.name, schema: BattleSubmissionSchema },
      { name: UserRanking.name, schema: UserRankingSchema },
    ]),
  ],
  controllers: [BattlesController],
  providers: [BattlesService],
  exports: [BattlesService],
})
export class BattlesModule {}
