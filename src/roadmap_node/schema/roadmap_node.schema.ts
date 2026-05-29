import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type RoadmapNodeDocument = HydratedDocument<RoadmapNode>;

@Schema({
  timestamps: true,
})
export class RoadmapNode {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Roadmap',
    required: true,
  })
  roadmapId!: mongoose.Types.ObjectId;

  @Prop({
    required: true,
  })
  title!: string;

  @Prop({
    enum: ['theory', 'practice', 'assignment', 'project'],
  })
  type!: string;

  @Prop()
  content!: string;

  @Prop({
    type: [String],
    default: [],
  })
  attachments!: string[];

  @Prop()
  unlockCondition!: number;
}

export const RoadmapNodeSchema = SchemaFactory.createForClass(RoadmapNode);
