import { HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
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
   ***********************************  LOGIN  *********************************
   *****************************************************************************/

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    const user = await this.usersService.findOneByEmail(email);

    const isPasswordMatching = await this.validatePassword(
      user.password,
      password,
    );

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

  /*****************************************************************************
   ******************************  PRIVATE METHOD  *****************************
   *****************************************************************************/

  /**
   * @description this method is used to validate the user's password by comparing the provided password from request and the stored password
   * @param {string} userPassword the stored password
   * @param {string} passwordDto the password from request
   * @return {Boolean} `true` if valid password, else `false`
   */
  private async validatePassword(userPassword: string, passwordDto: string) {
    const isPasswordMatching = await argon2.verify(userPassword, passwordDto);

    if (!isPasswordMatching) {
      throw new UnauthorizedException({
        status: HttpStatus.UNAUTHORIZED,
        error: {
          message: 'Wrong credentials',
        },
      });
    }

    return isPasswordMatching;
  }
}
