import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/schemas/user.schema';
import { CreateUserDto } from './dto/users.dto';
import * as argon2 from 'argon2';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(createUserDto: CreateUserDto) {
    const { name, email, password } = createUserDto;

    try {
      const hash = await argon2.hash(password);

      const newUser = new this.userModel({
        name,
        email,
        password: hash,
      });

      return await newUser.save();
    } catch (error) {
      if (error?.code === 11000) {
        throw new BadRequestException({
          status: HttpStatus.BAD_REQUEST,
          error: { ...error, message: 'Duplicate user' },
        });
      }

      throw new BadRequestException({
        status: HttpStatus.BAD_REQUEST,
        error: error,
      });
    }
  }

  async findOneByEmail(email: string) {
    return await this.userModel.findOne({ email });
  }

  async getAllUsers() {
    return await this.userModel.find({}, ['_id', 'name', 'email']);
  }
}
