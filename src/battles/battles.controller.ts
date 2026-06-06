import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';

import { BattlesService } from './battles.service';

import { CreateBattleDto } from './dto/create-battle.dto';
import { GetHistoryDto } from './dto/get-history.dto';
import { GetLeaderboardDto } from './dto/get-leaderboard.dto';
import { SubmitAnswerDto } from './dto/submit-answer.dto';

import { MockAuthGuard } from './mocks/mock-auth.guard';
import { CurrentUser } from './mocks/current-user.decorrator';
@Controller('battles')
@UseGuards(MockAuthGuard)
export class BattlesController {
  constructor(private readonly battlesService: BattlesService) {}

  @Post('match')
  create(
    @CurrentUser() user: { userId: string; username: string; avatar?: string },
    @Body() dto: CreateBattleDto,
  ) {
    return this.battlesService.createBattle(user, dto);
  }

  @Get('history')
  history(
    @CurrentUser() user: { userId: string },
    @Query() dto: GetHistoryDto,
  ) {
    return this.battlesService.getUserHistory(user.userId, dto);
  }

  @Get('leaderboard')
  leaderboard(@Query() dto: GetLeaderboardDto) {
    return this.battlesService.getLeaderboard(dto);
  }

  @Post(':id/submit')
  submit(
    @Param('id') id: string,
    @CurrentUser() user: { userId: string },
    @Body() dto: SubmitAnswerDto,
  ) {
    return this.battlesService.submitAnswer(id, user.userId, dto);
  }

  @Get(':id/submissions')
  submissions(@Param('id') id: string, @Query('userId') userId?: string) {
    return this.battlesService.getSubmissions(id, userId);
  }

  @Post(':id/end') end(@Param('id') id: string) {
    return this.battlesService.endBattle(id);
  }

  @Post(':id/abandon')
  abandon(@Param('id') id: string, @CurrentUser() user: { userId: string }) {
    return this.battlesService.abandonBattle(id, user.userId);
  }

  @Get(':id')
  getOne(@Param('id') id: string, @CurrentUser() user: { userId: string }) {
    return this.battlesService.getBattleById(id, user.userId);
  }
}
