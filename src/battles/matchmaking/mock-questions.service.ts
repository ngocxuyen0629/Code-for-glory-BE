import { Injectable } from '@nestjs/common';
import { Types } from 'mongoose';
import { IQuestion, IQuestionService } from '../interfaces/question.interface';
import { Field } from '../enums/field.enum';

@Injectable()
export class MockQuestionsService implements IQuestionService {
  private readonly mockQuestions: IQuestion[] = [
    {
      _id: new Types.ObjectId('507f1f77bcf86cd799439021'),
      title: '[MOCK] What is a closure in JavaScript?',
      content: 'Explain closure with a code example.',
      field: Field.FE,
      difficulty: 'easy',
      testCases: [],
      correctAnswer: 'closure',
    },
    {
      _id: new Types.ObjectId('507f1f77bcf86cd799439022'),
      title: '[MOCK] Explain React useEffect dependencies',
      content: 'When should you add a value to useEffect dependency array?',
      field: Field.FE,
      difficulty: 'medium',
      testCases: [],
      correctAnswer: 'dependency',
    },
    {
      _id: new Types.ObjectId('507f1f77bcf86cd799439023'),
      title: '[MOCK] Design a rate limiter',
      content: 'Implement a token bucket rate limiter in Node.js.',
      field: Field.BE,
      difficulty: 'hard',
      testCases: [],
      correctAnswer: 'token bucket',
    },
    {
      _id: new Types.ObjectId('507f1f77bcf86cd799439024'),
      title: '[MOCK] What is event loop?',
      content: 'Explain Node.js event loop with an example.',
      field: Field.BE,
      difficulty: 'easy',
      testCases: [],
      correctAnswer: 'event loop',
    },
  ];
  async findRandomByCriteria(
    field: Field,
    difficulty: string,
    count: number,
  ): Promise<IQuestion[]> {
    const pool = this.mockQuestions.filter(
      (q) => q.field == field && q.difficulty == difficulty,
    );
    const shuffled = [...pool].sort(() => Math.random() - 0.5);
    return Promise.resolve(shuffled.slice(0, count));
  }
}
