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

  @Get(':id')
  getOne(@Param('id') id: string, @CurrentUser() user: { userId: string }) {
    return this.battlesService.getBattleById(id, user.userId);
  }
}
