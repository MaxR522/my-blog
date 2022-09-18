import {
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
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<UserDocument>,
    private usersService: UsersService,
  ) {}

  /*****************************************************************************
   *********************************  REGISTER  ********************************
   *****************************************************************************/
  async register(registerDto: RegisterDto) {
    const { _id, name, email } = await this.usersService.create(registerDto);

    return {
      message: 'User created successfully',
      data: {
        _id,
        name,
        email,
      },
    };
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
