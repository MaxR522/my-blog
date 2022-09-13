import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';

/**
 * This controller will handle authentication endpoint:
 * - Register /register POST
 * - Login /login POST
 * - Forgot password
 */
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  register(@Body() registerDto: RegisterDto) {
    return this.authService?.register(registerDto);
  }
}
