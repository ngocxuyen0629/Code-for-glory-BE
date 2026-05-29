import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import {
  ErrorTracking,
  ErrorTrackingSchema,
} from './schema/error-tracking.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: ErrorTracking.name,
        schema: ErrorTrackingSchema,
      },
    ]),
  ],
})
export class ErrorTrackingModule {}
