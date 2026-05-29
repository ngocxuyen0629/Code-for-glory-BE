import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { Roadmap, RoadmapSchema } from './schema/roadmap.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Roadmap.name,
        schema: RoadmapSchema,
      },
    ]),
  ],
})
export class RoadmapsModule {}
