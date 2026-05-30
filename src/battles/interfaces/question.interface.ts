import { Types } from 'mongoose';
import { Field } from '../enums/field.enum';

export interface IQuestion {
  _id: Types.ObjectId | string;
  title: string;
  content: string;
  field: Field;
  difficulty: 'easy' | 'medium' | 'hard';
  testCases?: any[];
  correctAnswer?: string;
}

export interface IQuestionService {
  findRandomByCriteria(
    field: Field,
    difficulty: string,
    count: number,
  ): Promise<IQuestion[]>;
}
