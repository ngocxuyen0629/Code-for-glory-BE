import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { LearningPathService } from './learning-path.service';
import { CreateLearningPathDto } from './dto/create-learning-path.dto';
import { CreateNodeDto } from './dto/create-node.dto';
import { UseGuards } from '@nestjs/common';
import { MockAuthGuard } from './mocks/mock-auth.guard';
import { CurrentUser } from './mocks/current-user.decorator';
import { UpdateProgressDto } from './dto/update-progress.dto';

@Controller('learning-paths')
export class LearningPathController {
  constructor(private readonly learningPathService: LearningPathService) {}

  @Post()
  async createPath(@Body() dto: CreateLearningPathDto) {
    return this.learningPathService.createPath(dto);
  }

  @Get()
  async findAllPaths() {
    return this.learningPathService.findAllPaths();
  }

  @Get(':id')
  async findPathById(@Param('id') id: string) {
    return this.learningPathService.findPathById(id);
  }

  @Post(':id/nodes')
  async addNode(@Param('id') id: string, @Body() dto: CreateNodeDto) {
    return this.learningPathService.addNode(id, dto);
  }

  @Get(':id/nodes')
  async getNodes(@Param('id') id: string) {
    return this.learningPathService.getNodes(id);
  }

  @Post('nodes/:nodeId/progress')
  @UseGuards(MockAuthGuard)
  updateProgress(
    @CurrentUser() user: { userId: string },
    @Param('nodeId') nodeId: string,
    @Body() dto: UpdateProgressDto,
  ) {
    return this.learningPathService.updateProgress(user, nodeId, dto);
  }

  @Get(':id/my-progress')
  @UseGuards(MockAuthGuard)
  getMyProgress(
    @CurrentUser() user: { userId: string },
    @Param('id') pathId: string,
  ) {
    return this.learningPathService.getMyProgress(user, pathId);
  }
}
