import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { Penalty, PenaltySchema } from './schema/penalty.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Penalty.name,
        schema: PenaltySchema,
      },
    ]),
  ],
})
export class PenaltiesModule {}
