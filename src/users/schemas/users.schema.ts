import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({
  timestamps: true,
  versionKey: false,
})
export class User {
  @Prop({ required: true, unique: true, trim: true })
  email!: string;

  @Prop({ required: true })
  password!: string;

  @Prop({ required: true })
  name!: string;

  @Prop({ default: 'USER', enum: ['USER', 'ADMIN'] })
  role!: string;

  @Prop({ default: true })
  is_first_login!: boolean;

  @Prop({ default: 'Beginner', enum: ['Beginner', 'Intermediate', 'Advanced'] })
  level!: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
