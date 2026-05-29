import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import {
  CodeAnalysis,
  CodeAnalysisSchema,
} from './schema/code_analysis.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: CodeAnalysis.name,
        schema: CodeAnalysisSchema,
      },
    ]),
  ],
})
export class CodeAnalysisModule {}
