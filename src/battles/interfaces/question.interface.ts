import { Types } from 'mongoose';
import { CareerField } from '../../common/enums';

export interface IQuestion {
  _id: Types.ObjectId | string;
  title: string;
  content: string;
  field: CareerField;
  difficulty: 'easy' | 'medium' | 'hard';
  testCases?: any[];
  correctAnswer?: string;
}

export interface IQuestionService {
  findRandomByCriteria(
    field: CareerField,
    difficulty: string,
    count: number,
  ): Promise<IQuestion[]>;
}
