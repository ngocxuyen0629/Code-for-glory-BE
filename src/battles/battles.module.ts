import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { BattlesController } from './battles.controller';
import { BattlesService } from './battles.service';
import { BattlesGateway } from './battles.gateway';

import { Battle, BattleSchema } from './schemas/battle.schema';
import {
  BattleSubmission,
  BattleSubmissionSchema,
} from './schemas/battle-submission.schema';
import { UserRanking, UserRankingSchema } from './schemas/user-ranking.schema';

import { MatchmakingService } from './matchmaking/matchmaking.service';
import { MockQuestionsService } from './matchmaking/mock-questions.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Battle.name, schema: BattleSchema },
      { name: BattleSubmission.name, schema: BattleSubmissionSchema },
      { name: UserRanking.name, schema: UserRankingSchema },
    ]),
  ],
  controllers: [BattlesController],
  providers: [
    BattlesService,
    BattlesGateway,
    MatchmakingService,
    MockQuestionsService,
  ],
  exports: [BattlesService],
})
export class BattlesModule {}
