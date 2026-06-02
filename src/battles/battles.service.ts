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

import { BattleStatus } from './enums/battle-status.enum';

import { MatchmakingService } from './matchmaking/matchmaking.service';

import { BadRequestException } from '@nestjs/common';
import { SubmitAnswerDto } from './dto/submit-answer.dto';

import { BattlesGateway } from './battles.gateway';

@Injectable()
export class BattlesService {
  private readonly battleTimers = new Map<string, NodeJS.Timeout>();
  constructor(
    @InjectModel(Battle.name)
    private readonly battleModel: Model<BattleDocument>,
    @InjectModel(BattleSubmission.name)
    private readonly submissionModel: Model<BattleSubmissionsDocument>,
    @InjectModel(UserRanking.name)
    private readonly rankingModel: Model<UserRankingDocument>,
    private readonly matchmakingService: MatchmakingService,
    private readonly gateway: BattlesGateway,
  ) {}

  async createBattle(
    user: { userId: string; username: string; avatar?: string },
    dto: CreateBattleDto,
  ) {
    const battle = await this.matchmakingService.findOrCreate({
      userId: user.userId,
      username: user.username,
      avatar: user.avatar,
      mode: dto.mode,
      field: dto.field,
    });

    if (battle.status === BattleStatus.IN_PROGRESS) {
      this.startBattleTimer(String(battle._id), battle.timeLimit);
    }
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

  async submitAnswer(battleId: string, userId: string, dto: SubmitAnswerDto) {
    if (!Types.ObjectId.isValid(battleId)) {
      throw new NotFoundException('Battle not found');
    }

    const battle = await this.battleModel.findById(battleId);
    if (!battle) {
      throw new NotFoundException('Battle not found');
    }

    if (battle.status !== BattleStatus.IN_PROGRESS) {
      throw new BadRequestException('Battle is not in progress');
    }

    const playerIndex = battle.players.findIndex(
      (p) => p.userId.toString() === userId,
    );
    if (playerIndex == -1) {
      throw new ForbiddenException('You are not a player of this battle');
    }

    const question = battle.questions.find(
      (p) => p.questionId.toString() == dto.questionId,
    );
    if (!question) {
      throw new BadRequestException('Question not found in this battle');
    }

    const existingSubmission = await this.submissionModel.findOne({
      battleId: new Types.ObjectId(battleId),
      userId: new Types.ObjectId(userId),
      questionId: new Types.ObjectId(dto.questionId),
      isCorrect: true,
    });

    if (existingSubmission) {
      throw new BadRequestException(
        'You already answered this question correctly',
      );
    }

    const isCorrect =
      dto.answer.trim() === (question.correctAnswer ?? '').trim();

    const player = battle.players[playerIndex];
    const newScore = isCorrect
      ? player.currentScore + 10
      : Math.max(0, player.currentScore - 3);
    const pointsChange = newScore - player.currentScore;

    await Promise.all([
      this.submissionModel.create({
        battleId: new Types.ObjectId(battleId),
        userId: new Types.ObjectId(userId),
        questionId: new Types.ObjectId(dto.questionId),
        answer: dto.answer,
        isCorrect,
        points: pointsChange,
        timeSpent: 0,
      }),
      this.battleModel.findByIdAndUpdate(battleId, {
        $set: {
          [`players.${playerIndex}.currentScore`]: newScore,
        },
      }),
    ]);

    if (isCorrect) {
      const questionOrder = battle.questions.findIndex(
        (q) => q.questionId.toString() === dto.questionId,
      );

      this.gateway.notifyCorrectSubmit(battleId, {
        userId,
        questionId: dto.questionId,
        questionOrder,
      });
    }

    const correctCount = await this.submissionModel.countDocuments({
      battleId: new Types.ObjectId(battleId),
      userId: new Types.ObjectId(userId),
      isCorrect: true,
    });

    if (correctCount >= battle.questions.length) {
      await this.endBattle(battleId);
    }
    return {
      isCorrect,
      points: pointsChange,
      currentScore: newScore,
      currentQuestionIndex: correctCount,
      message: isCorrect ? 'Correct' : 'Wrong answer, -3 points',
    };
  }

  async endBattle(battleId: string) {
    const battle = await this.battleModel.findById(battleId);
    if (!battle) {
      throw new NotFoundException('Battle not found');
    }
    if (battle.status !== BattleStatus.IN_PROGRESS) {
      throw new BadRequestException('Battle is not in progress');
    }

    const [p1, p2] = battle.players;
    const isDraw = p1.currentScore === p2.currentScore;
    const winner = isDraw ? null : p1.currentScore > p2.currentScore ? p1 : p2;
    const loser = isDraw
      ? null
      : winner?.userId.toString() === p1.userId.toString()
        ? p2
        : p1;

    const finalScores = battle.players.map((p) => ({
      userId: p.userId.toString(),
      username: p.username,
      score: p.currentScore,
    }));

    await this.battleModel.findByIdAndUpdate(battleId, {
      $set: {
        status: BattleStatus.COMPLETED,
        endTime: new Date(),
        result: {
          winnerId: winner?.userId ?? null,
          isDraw,
          finalScores,
        },
      },
    });

    const endResult = {
      battleId,
      isDraw,
      winner: winner
        ? { userId: winner.userId.toString(), username: winner.username }
        : null,
      loser: loser
        ? { userId: loser.userId.toString(), username: loser.username }
        : null,
      finalScores,
    };

    await this.updateRankings(battle, winner?.userId ?? null, isDraw);

    this.stopBattleTimer(battleId);
    this.gateway.notifyBattleEnded(battleId, {
      winnerId: winner?.userId.toString(),
      isDraw,
      finalScores,
    });
    return endResult;
  }
  async getSubmissions(battleId: string, userId?: string) {
    if (!Types.ObjectId.isValid(battleId)) {
      throw new NotFoundException('Battle not foun');
    }
    const filter: Record<string, unknown> = {
      battleId: new Types.ObjectId(battleId),
    };
    if (userId && Types.ObjectId.isValid(userId)) {
      filter.userId = new Types.ObjectId(userId);
    }

    return this.submissionModel.find(filter).sort({ submittedAt: 1 }).lean();
  }

  startBattleTimer(battleId: string, timeLimit: number) {
    if (this.battleTimers.has(battleId)) return;

    let timeRemaining = timeLimit;

    const interval = setInterval(() => {
      timeRemaining--;
      this.gateway.pushTimerTick(battleId, timeRemaining);

      if (timeRemaining <= 0) {
        this.stopBattleTimer(battleId);
        this.endBattle(battleId).catch(() => {});
      }
    }, 1000);
    this.battleTimers.set(battleId, interval);
  }
  stopBattleTimer(battleId: string) {
    const interval = this.battleTimers.get(battleId);
    if (interval) {
      clearInterval(interval);
      this.battleTimers.delete(battleId);
    }
  }
  async abandonBattle(battleId: string, userId: string) {
    if (!Types.ObjectId.isValid(battleId))
      throw new NotFoundException('Battle not found');

    const battle = await this.battleModel.findById(battleId);
    if (!battle) throw new NotFoundException('Battle not found');
    if (
      battle.status !== BattleStatus.IN_PROGRESS &&
      battle.status !== BattleStatus.COMPLETED
    ) {
      throw new BadRequestException('Battle already ended');
    }

    const opponent = battle.players.find((p) => p.userId.toString() !== userId);

    const finalScores = battle.players.map((p) => ({
      userId: p.userId.toString(),
      userName: p.username,
      score: p.currentScore,
    }));

    await this.battleModel.findByIdAndUpdate(battleId, {
      $set: {
        status: BattleStatus.ABANDONED,
        endTime: new Date(),
        result: {
          winnerId: opponent?.userId ?? null,
          isDraw: false,
          finalScores,
        },
      },
    });

    await this.updateRankings(battle, opponent?.userId ?? null, false);

    this.stopBattleTimer(battleId);

    this.gateway.notifyBattleEnded(battleId, {
      winnerId: opponent?.userId.toString(),
      isDraw: false,
      finalScores,
    });
    return {
      message: 'Battle abandoned',
      winnerId: opponent?.userId.toString(),
    };
  }

  private async updateRankings(
    battle: BattleDocument,
    winnerId: Types.ObjectId | null,
    isDraw: boolean,
  ) {
    const updates = battle.players.map(async (p) => {
      const isWinner = !isDraw && winnerId?.toString() === p.userId.toString();
      const isLoser = !isDraw && !isWinner;

      const updated = await this.rankingModel
        .findOneAndUpdate(
          { userId: p.userId, field: battle.field },
          {
            $inc: {
              totalBattles: 1,
              wins: isWinner ? 1 : 0,
              losses: isLoser ? 1 : 0,
              draws: isDraw ? 1 : 0,
            },
          },
          { upsert: true, new: true },
        )
        .lean();
      const winRate =
        updated.totalBattles > 0 ? updated.wins / updated.totalBattles : 0;

      await this.rankingModel.findByIdAndUpdate(updated._id, {
        $set: { winRate },
      });
    });
    await Promise.all(updates);
  }
}
