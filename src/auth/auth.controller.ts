import { Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

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
  register() {
    return this.authService?.register();
  }
}
