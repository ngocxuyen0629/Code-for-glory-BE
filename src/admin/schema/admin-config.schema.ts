import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type AdminConfigDocument = HydratedDocument<AdminConfig>;

/**
 * AdminConfig — Per-feature configuration written from the Admin Dashboard.
 *
 * From the admin user-flow diagram (page 20):
 *   - AIConfigs DB    → AI Mentor settings
 *   - LearningPaths   → which paths are active
 *   - Nodes DB        → CRUD nodes
 *   - RecallTasks DB  → recall configuration
 *
 * Stored as one document per (scope, key) pair — keeps the dashboard
 * simple and lets admins version rules without redeploys.
 */
@Schema({ timestamps: true })
export class AdminConfig {
  /** Logical bucket: 'ai_mentor' | 'penalty' | 'recall' | 'tracking' | 'battle' | 'general' */
  @Prop({ type: String, required: true })
  scope!: string;

  @Prop({ type: String, required: true })
  key!: string; // eg. 'default_hint_style', 'max_submit_attempts_strict'

  @Prop({ type: Object, required: true })
  value!: Record<string, unknown> | string | number | boolean;

  @Prop({ type: String })
  description?: string;

  @Prop({ type: Boolean, default: true })
  isActive!: boolean;

  /** Admin who last edited it — audit trail */
  @Prop({ type: Types.ObjectId, ref: 'User' })
  updatedBy?: Types.ObjectId;

  @Prop({ type: Number, default: 1 })
  version!: number;
}

export const AdminConfigSchema = SchemaFactory.createForClass(AdminConfig);

AdminConfigSchema.index({ scope: 1, key: 1 }, { unique: true });
AdminConfigSchema.index({ scope: 1, isActive: 1 });
