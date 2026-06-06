import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { LoginAttemptResult } from '../../common/enums';

export type LoginAttemptDocument = HydratedDocument<LoginAttempt>;

/**
 * Login_Attempts_Log
 *
 * Drives the exponential-backoff rules described in the doc:
 *   Lần 1-3: thông báo chung
 *   Lần 4-5: hiện CAPTCHA, cooldown 30s
 *   Lần >5:  khoá account 15 phút + email cảnh báo
 */
@Schema({ timestamps: { createdAt: true, updatedAt: false } })
export class LoginAttempt {
  @Prop({ type: Types.ObjectId, ref: 'User' })
  userId?: Types.ObjectId; // có thể null nếu email không tồn tại

  @Prop({ type: String, required: true, lowercase: true })
  email!: string;

  @Prop({ type: String, enum: LoginAttemptResult, required: true })
  result!: LoginAttemptResult;

  @Prop({ type: String })
  ipAddress?: string;

  @Prop({ type: String })
  userAgent?: string;

  @Prop({ type: Boolean, default: false })
  captchaRequired!: boolean;

  @Prop({ type: Boolean, default: false })
  captchaPassed!: boolean;
}

export const LoginAttemptSchema = SchemaFactory.createForClass(LoginAttempt);

LoginAttemptSchema.index({ email: 1, createdAt: -1 });
LoginAttemptSchema.index({ userId: 1, createdAt: -1 });
// TTL — auto purge attempts older than 30 days
LoginAttemptSchema.index(
  { createdAt: 1 },
  { expireAfterSeconds: 60 * 60 * 24 * 30 },
);
