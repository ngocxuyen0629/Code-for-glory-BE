import { Logger, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

import appConfig from './config/app.config';
import authConfig from './config/auth.config';
import databaseConfig from './config/database.config';
import mailConfig from './config/mail.config';
import oauthConfig from './config/oauth.config';

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
      load: [appConfig, authConfig, databaseConfig, mailConfig, oauthConfig],
    }),

    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        uri: config.getOrThrow<string>('database.uri'),
        connectionFactory: (connection: Connection) => {
          const logger = new Logger('Mongoose');
          // Factory is called after the connection is established,
          // so log immediately instead of waiting for the 'connected' event
          logger.log(
            `Connected to MongoDB: ${connection.host}/${connection.name}`,
          );
          connection.on('reconnected', () =>
            logger.log('Reconnected to MongoDB'),
          );
          connection.on('error', (error: Error) =>
            logger.error(`MongoDB connection error: ${error.message}`),
          );
          connection.on('disconnected', () =>
            logger.warn('Disconnected from MongoDB'),
          );
          return connection;
        },
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
