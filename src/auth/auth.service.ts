import {
  HttpStatus,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { LoginDto, RegisterDto } from './dto/auth.dto';
import * as argon2 from 'argon2';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

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
   ******************************* VALIDATE USER  ******************************
   *****************************************************************************/

  async validateUser(email: string, password: string) {
    const user = await this.usersService.findOneByEmail(email);
    const isPasswordMatching = await argon2.verify(user.password, password);

    if (isPasswordMatching) {
      return user;
    }

    return null;
  }

  /*****************************************************************************
   ***********************************  LOGIN  *********************************
   *****************************************************************************/

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    const user = await this.usersService.findOneByEmail(email);

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
          message: 'Wrong credentials',
        },
      });
    }

    if (isPasswordMatching) {
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
}
