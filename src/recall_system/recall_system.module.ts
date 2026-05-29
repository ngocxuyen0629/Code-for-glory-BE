import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import {
  RecallSystem,
  RecallSystemSchema,
} from './schema/recall_system.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: RecallSystem.name,
        schema: RecallSystemSchema,
      },
    ]),
  ],
})
export class RecallSystemModule {}
