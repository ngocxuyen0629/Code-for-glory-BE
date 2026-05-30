import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';

import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import { Battle, BattleDocument } from './schemas/battle.schema';
import {
  UserRanking,
  UserRankingDocument,
} from './schemas/user-ranking.schema';
import {
  BattleSubmission,
  BattleSubmissionsDocument,
} from './schemas/battle-submission.schema';

import { CreateBattleDto } from './dto/create-battle.dto';
import { GetHistoryDto } from './dto/get-history.dto';
import { GetLeaderboardDto } from './dto/get-leaderboard.dto';

import { BattleMode } from './enums/battle-mode.enum';
import { BattleStatus } from './enums/battle-status.enum';

@Injectable()
export class BattlesService {
  constructor(
    @InjectModel(Battle.name)
    private readonly battleModel: Model<BattleDocument>,
    @InjectModel(BattleSubmission.name)
    private readonly submissionModel: Model<BattleSubmissionsDocument>,
    @InjectModel(UserRanking.name)
    private readonly rankingModel: Model<UserRankingDocument>,
  ) {}

  // async createBattle(userId: string, dto: CreateBattleDto) {
  //   const timeLimit = dto.mode == BattleMode.SPEED ? 600 : 1800;

  //   const battle = await this.battleModel.create({
  //     mode: dto.mode,
  //     field: dto.field,
  //     status: BattleStatus.WAITING,
  //     players: [
  //       {
  //         userId: new Types.ObjectId(userId),
  //         score: 0,
  //         isReady: false,
  //       },
  //     ],
  //     questions: [],
  //     timeLimit,
  //     startTime: new Date(),
  //   });

  //   return Battle;
  // }

  async createBattle(
    user: { userId: string; username: string; avatar?: string },
    dto: CreateBattleDto,
  ) {
    const timeLimit = dto.mode === BattleMode.SPEED ? 600 : 1800;

    const battle = await this.battleModel.create({
      mode: dto.mode,
      field: dto.field,
      status: BattleStatus.WAITING,
      players: [
        {
          userId: new Types.ObjectId(user.userId),
          username: user.username,
          avatar: user.avatar,
          currentScore: 0,
          hasSubmitted: false,
          joinedAt: new Date(),
        },
      ],
      questions: [],
      timeLimit,
    });

    return battle;
  }
  async getBattleById(battleId: string, userId: string) {
    if (!Types.ObjectId.isValid(battleId)) {
      throw new NotFoundException('Battle not found!');
    }

    const battle = await this.battleModel.findById(battleId).lean();
    if (!battle) {
      throw new NotFoundException('Battle not found!');
    }

    const isPlayer = battle.players.some((p) => p.userId.toString() == userId);
    if (!isPlayer) {
      throw new ForbiddenException('You are not player of this battle');
    }
    return battle;
  }
  async getUserHistory(userId: string, dto: GetHistoryDto) {
    const page = dto.page ?? 1;
    const limit = dto.limit ?? 10;
    const skip = (page - 1) * limit;

    const filter = {
      'players.userId': new Types.ObjectId(userId),
      status: { $in: [BattleStatus.COMPLETED, BattleStatus.ABANDONED] },
    };
    const [items, total] = await Promise.all([
      this.battleModel
        .find(filter)
        .sort({ endTime: -1, createAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      this.battleModel.countDocuments(filter),
    ]);

    return {
      items,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
  async getLeaderboard(dto: GetLeaderboardDto) {
    const limit = dto.limit ?? 20;

    const rankings = await this.rankingModel
      .find({ field: dto.field })
      .sort({ ratingPoints: -1, winRate: -1 })
      .limit(limit)
      .lean();
    return rankings;
  }
}
