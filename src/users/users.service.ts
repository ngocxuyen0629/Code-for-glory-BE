import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/users.schema';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { UserRole } from '../common/enums';

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
      username: createUserDto.name,
      password: hashedPassword,
      role: UserRole.USER,
      isFirstLogin: true,
    });
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }
  async findOneByEmail(email: string): Promise<UserDocument | null> {
    // password has `select: false` in the schema — must opt in for login check
    return this.userModel.findOne({ email }).select('+password').exec();
  }
}
