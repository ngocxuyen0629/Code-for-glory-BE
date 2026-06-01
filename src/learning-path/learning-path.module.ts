import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { LearningPathController } from './learning-path.controller';
import { LearningPathService } from './learning-path.service';

import {
  LearningPath,
  LearningPathSchema,
} from './schemas/learning-path.schema';
import {
  LearningNode,
  LearningNodeSchema,
} from './schemas/learning-node.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: LearningPath.name, schema: LearningPathSchema },
      { name: LearningNode.name, schema: LearningNodeSchema },
    ]),
  ],
  controllers: [LearningPathController],
  providers: [LearningPathService],
})
export class LearningPathModule {}
