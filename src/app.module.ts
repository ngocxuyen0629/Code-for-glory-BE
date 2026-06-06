import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { LearningPathModule } from './learning-path/learning-path.module';
import { BattlesModule } from './battles/battles.module';
import { RecallModule } from './recall/recall.module';
import { AIMentorModule } from './ai-mentor/ai-mentor.module';
import { PenaltiesModule } from './penalties/penalty.module';
import { ExercisesModule } from './exercises/exercises.module';
import { ErrorTrackingModule } from './error-tracking/error-tracking.module';
import { HistoryModule } from './history/history.module';
import { NotificationsModule } from './notifications/notification.module';
import { SurveyModule } from './survey/survey.module';
import { AdminModule } from './admin/admin.module';
import { CommonModule } from './common/common.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        uri: config.getOrThrow<string>('MONGODB_URI'),
      }),
    }),

    CommonModule,

    AuthModule,
    UsersModule,

    LearningPathModule,
    ExercisesModule,
    BattlesModule,
    RecallModule,

    AIMentorModule,
    PenaltiesModule,

    ErrorTrackingModule,
    HistoryModule,
    NotificationsModule,
    SurveyModule,
    AdminModule,
  ],
})
export class AppModule {}
