import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { OtpPurpose } from '../../common/enums';

export type OtpDocument = HydratedDocument<Otp>;

/**
 * One-time password used in the "Forgot Password" flow described
 * in section A>3 of the doc:
 *   - Nhập email → gửi OTP có thời hạn 5-10 phút
 *   - User nhập OTP đúng → chuyển sang Reset Password
 *   - Sai OTP > 3 lần → khoá nút Enter OTP, đưa về login
 */
@Schema({ timestamps: true })
export class Otp {
  @Prop({ type: Types.ObjectId, ref: 'User' })
  userId?: Types.ObjectId;

  @Prop({ type: String, required: true, lowercase: true })
  email!: string;

  @Prop({ type: String, required: true })
  codeHash!: string; // hashed for safety

  @Prop({ type: String, enum: OtpPurpose, required: true })
  purpose!: OtpPurpose;

  @Prop({ type: Date, required: true })
  expiresAt!: Date;

  @Prop({ type: Number, default: 0 })
  attempts!: number; // số lần đã thử

  @Prop({ type: Number, default: 3 })
  maxAttempts!: number;

  @Prop({ type: Boolean, default: false })
  used!: boolean;

  @Prop({ type: Date })
  usedAt?: Date;
}

export const OtpSchema = SchemaFactory.createForClass(Otp);

OtpSchema.index({ email: 1, purpose: 1, used: 1 });
// TTL — Mongo will delete expired docs automatically
OtpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
