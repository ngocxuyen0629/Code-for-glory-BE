import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type RefreshTokenDocument = HydratedDocument<RefreshToken>;

/**
 * Stores hashed refresh tokens so they can be revoked individually
 * (e.g. on logout, password change, suspicious-login email).
 */
@Schema({ timestamps: true })
export class RefreshToken {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId!: Types.ObjectId;

  @Prop({ type: String, required: true })
  tokenHash!: string; // sha256(refresh_token) — never store raw

  @Prop({ type: Date, required: true })
  expiresAt!: Date;

  @Prop({ type: Boolean, default: false })
  revoked!: boolean;

  @Prop({ type: Date })
  revokedAt?: Date;

  @Prop({ type: String })
  ipAddress?: string;

  @Prop({ type: String })
  userAgent?: string;

  @Prop({ type: String })
  replacedByTokenHash?: string; // token rotation chain
}

export const RefreshTokenSchema = SchemaFactory.createForClass(RefreshToken);

RefreshTokenSchema.index({ tokenHash: 1 }, { unique: true });
RefreshTokenSchema.index({ userId: 1, revoked: 1 });
// Auto-cleanup expired tokens
RefreshTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
