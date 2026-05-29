import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema({
  timestamps: true,
})
export class User {
  @Prop({ required: true, unique: true })
  username!: string;

  @Prop({ required: true, unique: true })
  email!: string;

  @Prop({ required: true })
  password!: string;

  @Prop({ default: 'USER' })
  role!: string;

  @Prop({ default: true })
  isFirstLogin!: boolean;

  @Prop({
    enum: ['beginner', 'intermediate', 'advanced'],
  })
  level!: string;

  @Prop()
  fieldPreference!: string;

  @Prop()
  weakness!: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
