import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import {
  UserProgress,
  UserProgressSchema,
} from './schema/user-progress.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: UserProgress.name,
        schema: UserProgressSchema,
      },
    ]),
  ],
})
export class UserProgressModule {}
