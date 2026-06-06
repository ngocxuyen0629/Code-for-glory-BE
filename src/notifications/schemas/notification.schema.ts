import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { NotificationType } from '../../common/enums';

export type NotificationDocument = HydratedDocument<Notification>;

/**
 * Notification — in-app + (optionally) push.
 *
 * Streak-break flow (survey, 47.1%):
 *   ngày 1 → nhẹ
 *   ngày 3 → vừa
 *   ngày 7 → mạnh
 *
 * Suspicious login (page 14): "Phát hiện hành động đăng nhập bất thường".
 */
@Schema({ timestamps: true })
export class Notification {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId!: Types.ObjectId;

  @Prop({ type: String, enum: NotificationType, required: true })
  type!: NotificationType;

  @Prop({ type: String, required: true })
  title!: string;

  @Prop({ type: String, required: true })
  body!: string;

  /** Optional deep-link inside the app */
  @Prop({ type: String })
  actionUrl?: string;

  /** Generic payload — eg. battleId, nodeId, errorType */
  @Prop({ type: Object, default: {} })
  data!: Record<string, unknown>;

  @Prop({ type: Boolean, default: false })
  read!: boolean;

  @Prop({ type: Date })
  readAt?: Date;

  /** For scheduled notifications — fire at this time */
  @Prop({ type: Date })
  scheduledAt?: Date;

  @Prop({ type: Boolean, default: false })
  sent!: boolean;

  @Prop({ type: Date })
  sentAt?: Date;

  /** 'low' | 'normal' | 'high' — drives sound/style on mobile */
  @Prop({ type: String, default: 'normal' })
  priority!: string;

  /** Escalation level (1-3) for streak reminders */
  @Prop({ type: Number, default: 0 })
  escalationLevel!: number;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);

NotificationSchema.index({ userId: 1, createdAt: -1 });
NotificationSchema.index({ userId: 1, read: 1 });
NotificationSchema.index({ scheduledAt: 1, sent: 1 });
