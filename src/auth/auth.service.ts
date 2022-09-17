import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/schemas/user.schema';
import { RegisterDto } from './dto/register.dto';
import * as argon2 from 'argon2';

/**
 * This service will handle authentication logic:
 * - Register
 * - Login
 * - Forgot password
 */
@Injectable()
export class AuthService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async register(registerDto: RegisterDto) {
    const { name, email, password } = registerDto;

    try {
      const hash = await argon2.hash(password);

      const newUser = new this.userModel({
        name,
        email,
        password: hash,
      });

      const createdUser = await newUser.save();

      return {
        message: 'User created',
        data: {
          _id: createdUser?._id,
          name: createdUser?.name,
          email: createdUser?.email,
        },
      };
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
}
