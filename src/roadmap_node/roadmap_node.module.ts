import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { RoadmapNode, RoadmapNodeSchema } from './schema/roadmap_node.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: RoadmapNode.name,
        schema: RoadmapNodeSchema,
      },
    ]),
  ],
})
export class RoadmapNodesModule {}
