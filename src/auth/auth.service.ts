import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/schemas/user.schema';
import { LoginDto, RegisterDto } from './dto/auth.dto';
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

  /*****************************************************************************
   *********************************  REGISTER  ********************************
   *****************************************************************************/
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

  /*****************************************************************************
   ***********************************  LOGIN  *********************************
   *****************************************************************************/

  async login(loginDto: LoginDto) {
    const { name, email, password } = loginDto;

    const searchParam = email ? { email: email } : { name: name };

    const user = await this.userModel.findOne(searchParam);

    if (!user) {
      throw new NotFoundException({
        status: HttpStatus.NOT_FOUND,
        error: {
          message: 'User not found',
        },
      });
    }

    const isPasswordMatching = await argon2.verify(user.password, password);

    if (!isPasswordMatching) {
      throw new UnauthorizedException({
        status: HttpStatus.UNAUTHORIZED,
        error: {
          message: 'Wrong credential',
        },
      });
    }

    return {
      message: 'user login success',
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
      },
    };
  }
}
