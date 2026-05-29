import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { Battle, BattleSchema } from './schema/battle.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Battle.name,
        schema: BattleSchema,
      },
    ]),
  ],
})
export class BattlesModule {}
