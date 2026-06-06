import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import { LearningPath } from './schemas/learning-path.schema';
import { LearningNode } from './schemas/learning-node.schema';
import { CreateLearningPathDto } from './dto/create-learning-path.dto';
import { CreateNodeDto } from './dto/create-node.dto';
import { Progress } from './schemas/progress.schema';
import { UpdateProgressDto } from './dto/update-progress.dto';

@Injectable()
export class LearningPathService {
  constructor(
    @InjectModel(LearningPath.name)
    private readonly pathModel: Model<LearningPath>,
    @InjectModel(LearningNode.name)
    private readonly nodeModel: Model<LearningNode>,
    @InjectModel(Progress.name)
    private readonly progressModel: Model<Progress>,
  ) {}

  async createPath(dto: CreateLearningPathDto) {
    const path = await this.pathModel.create({
      title: dto.title,
      description: dto.description,
      field: dto.field,
    });

    return path;
  }

  async findAllPaths() {
    return this.pathModel.find();
  }

  async findPathById(pathId: string) {
    const path = await this.pathModel.findById(pathId);
    if (!path) {
      throw new NotFoundException('Learning path not found');
    }
    return path;
  }

  async addNode(pathId: string, dto: CreateNodeDto) {
    await this.findPathById(pathId);

    const parentId = dto.parentId
      ? new Types.ObjectId(dto.parentId)
      : undefined;
    return this.nodeModel.create({
      pathId: new Types.ObjectId(pathId),
      parentId: parentId,
      type: dto.type,
      title: dto.title,
      order: dto.order,
      theory: dto.theory,
      quizzes: dto.quizzes,
      problemStatement: dto.problemStatement,
      starterCode: dto.starterCode,
      expectedOutput: dto.expectedOutput,
    });
  }

  async getNodes(pathId: string) {
    await this.findPathById(pathId);
    return this.nodeModel
      .find({ pathId: new Types.ObjectId(pathId) })
      .sort({ order: 1 });
  }

  async updateProgress(
    user: { userId: string },
    nodeId: string,
    dto: UpdateProgressDto,
  ) {
    const node = await this.nodeModel.findById(nodeId);
    if (!node) {
      throw new NotFoundException('Node not found');
    }

    return this.progressModel.findOneAndUpdate(
      {
        userId: new Types.ObjectId(user.userId),
        nodeId: new Types.ObjectId(nodeId),
      },
      {
        userId: new Types.ObjectId(user.userId),
        nodeId: new Types.ObjectId(nodeId),
        pathId: node.pathId,
        status: dto.status,
        quizScore: dto.quizScore,
      },
      { new: true, upsert: true },
    );
  }

  async getMyProgress(user: { userId: string }, pathId: string) {
    await this.findPathById(pathId);
    return this.progressModel.find({
      userId: new Types.ObjectId(user.userId),
      pathId: new Types.ObjectId(pathId),
    });
  }
}
