import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type AIChatMessageDocument = HydratedDocument<AIChatMessage>;

@Schema({
  timestamps: true,
})
export class AIChatMessage {
  @Prop({
    required: true,
  })
  sessionId!: string;

  @Prop({
    enum: ['user', 'model'],
    required: true,
  })
  role!: string;

  @Prop({
    required: true,
  })
  content!: string;

  @Prop({
    default: 0,
  })
  tokenUsed!: number;

  @Prop({
    default: Date.now,
  })
  createdAt!: Date;
}

export const AIChatMessageSchema = SchemaFactory.createForClass(AIChatMessage);
