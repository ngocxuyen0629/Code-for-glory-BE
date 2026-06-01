import {
  Injectable,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import { Battle, BattleDocument } from '../schemas/battle.schema';
import { BattleMode } from '../enums/battle-mode.enum';
import { BattleStatus } from '../enums/battle-status.enum';
import { Field } from '../enums/field.enum';
import { MockQuestionsService } from './mock-questions.service';
import { IQuestion } from '../interfaces/question.interface';

interface MatchInput {
  userId: string;
  username: string;
  avatar?: string;
  mode: BattleMode;
  field: Field;
}

@Injectable()
export class MatchmakingService {
  constructor(
    @InjectModel(Battle.name)
    private readonly battleModel: Model<BattleDocument>,
    private readonly questionsService: MockQuestionsService,
  ) {}

  async findActiveForUser(userId: string): Promise<BattleDocument | null> {
    return this.battleModel
      .findOne({
        'players.userId': new Types.ObjectId(userId),
        status: { $in: [BattleStatus.WAITING, BattleStatus.IN_PROGRESS] },
      })
      .lean() as Promise<BattleDocument | null>;
  }

  async findOrCreate(input: MatchInput): Promise<BattleDocument> {
    const existingBattle = await this.findActiveForUser(input.userId);
    if (existingBattle) {
      throw new ConflictException(
        'You already have an active battle. Finish or abandon it first.',
      );
    }
    const newPlayer = {
      userId: new Types.ObjectId(input.userId),
      username: input.username,
      avatar: input.avatar,
      currentScore: 0,
      hasSubmitted: false,
      joinedAt: new Date(),
    };
    const joined = await this.attemptJoin(input, newPlayer);
    if (joined) return joined;

    return this.createWaitingBattle(input, newPlayer);
  }

  private async attemptJoin(
    input: MatchInput,
    newPlayer: object,
  ): Promise<BattleDocument | null> {
    const timeLimit = input.mode === BattleMode.SPEED ? 600 : 1800;
    const now = new Date();
    const question = await this.buildQuestionsForMode(input.mode, input.field);

    const updated = await this.battleModel.findOneAndUpdate(
      {
        status: BattleStatus.WAITING,
        mode: input.mode,
        field: input.field,

        $expr: { $lt: [{ $size: '$players' }, 2] },
        'players.userId': { $ne: new Types.ObjectId(input.userId) },
      },
      {
        $push: { players: newPlayer },
        $set: {
          status: BattleStatus.IN_PROGRESS,
          startTime: now,
          expectedEndTime: new Date(now.getTime() + timeLimit * 1000),
          questions: question,
        },
      },
      { new: true },
    );

    return updated as BattleDocument | null;
  }

  private async createWaitingBattle(
    input: MatchInput,
    newPlayer: object,
  ): Promise<BattleDocument> {
    const timeLimit = input.mode == BattleMode.SPEED ? 600 : 1800;

    const created = await this.battleModel.create({
      mode: input.mode,
      field: input.field,
      status: BattleStatus.WAITING,
      players: [newPlayer],
      questions: [],
      timeLimit,
    });

    if (!created)
      throw new InternalServerErrorException('Failed to create battle');
    return created as BattleDocument;
  }

  private async buildQuestionsForMode(mode: BattleMode, field: Field) {
    let rawQuestions: IQuestion[];

    if (mode == BattleMode.SPEED) {
      rawQuestions = await this.questionsService.findRandomByCriteria(
        field,
        'easy',
        1,
      );
    } else {
      const [medium, hard] = await Promise.all([
        this.questionsService.findRandomByCriteria(field, 'medium', 2),
        this.questionsService.findRandomByCriteria(field, 'hard', 1),
      ]);
      rawQuestions = [...medium, ...hard];
    }

    return rawQuestions.map((q) => ({
      questionId: q._id,
      title: q.title,
      content: q.content,
      difficulty: q.difficulty,
      testCases: q.testCases ?? [],
      correctAnswer: q.correctAnswer,
    }));
  }
}
