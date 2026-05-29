import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type RoadmapDocument = HydratedDocument<Roadmap>;

@Schema({
  timestamps: true,
})
export class Roadmap {
  @Prop({
    required: true,
  })
  field!: string;

  @Prop({
    enum: ['beginner', 'intermediate', 'advanced'],
  })
  level!: string;

  @Prop({
    type: [String],
    default: [],
  })
  nodes!: string[];
}

export const RoadmapSchema = SchemaFactory.createForClass(Roadmap);
