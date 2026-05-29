import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { AIChatMessage, AIChatMessageSchema } from './schema/ai_chat_message';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: AIChatMessage.name,
        schema: AIChatMessageSchema,
      },
    ]),
  ],
})
export class AIChatMessageModule {}
