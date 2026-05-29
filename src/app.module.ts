import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';

/* USERS */
import { UsersModule } from './users/user.module';

/* RECALL SYSTEM */
import { RecallSystemModule } from './recall_system/recall_system.module';

/* QUESTIONS */
import { QuestionsModule } from './question/question.module';

/* ERROR TRACKING */
import { ErrorTrackingModule } from './error_tracking/error_tracking.module';

/* USER RANKING */
import { UserRankingModule } from './user_ranking/user_ranking.module';

/* USER PROGRESS */
import { UserProgressModule } from './user_progress/user_progress.module';

/* ROADMAPS */
import { RoadmapsModule } from './roadmap/roadmap.module';

/* ROADMAP NODES */
import { RoadmapNodesModule } from './roadmap_node/roadmap_node.module';

/* BATTLES */
import { BattlesModule } from './battle/battle.module';

/* CODE ANALYSIS */
import { CodeAnalysisModule } from './code_analysis/code_analysis.module';

/* AI CHAT MESSAGE */
import { AIChatMessageModule } from './ai_chat_message/ai_chat_message.module';

/* PENALTIES */
import { PenaltiesModule } from './penalties/penalties.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    MongooseModule.forRoot(process.env.MONGODB_URL!),

    UsersModule,

    RecallSystemModule,

    QuestionsModule,

    ErrorTrackingModule,

    UserRankingModule,

    UserProgressModule,

    RoadmapsModule,

    RoadmapNodesModule,

    BattlesModule,

    CodeAnalysisModule,

    AIChatMessageModule,

    PenaltiesModule,
  ],

  controllers: [],

  providers: [],
})
export class AppModule {}
