import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/schemas/user.schema';
import { RegisterDto } from './dto/register.dto';

/**
 * This service will handle authentication logic:
 * - Register
 * - Login
 * - Forgot password
 */
@Injectable()
export class AuthService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  register(registerDto: RegisterDto) {
    console.log(registerDto);
  }
}
