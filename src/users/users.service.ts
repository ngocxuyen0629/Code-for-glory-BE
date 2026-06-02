import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/users.schema';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    if (!createUserDto || !createUserDto.password) {
      throw new BadRequestException('Password is required');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(createUserDto.password, salt);

    return await this.userModel.create({
      email: createUserDto.email,
      name: createUserDto.name,
      password: hashedPassword,
      role: 'USER',
      level: 'Beginner',
      is_first_login: true,
    });
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }
  async findOneByEmail(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email }).exec();
  }
}
