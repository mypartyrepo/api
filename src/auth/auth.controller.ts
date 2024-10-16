import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupDto } from './dtos/signup.dto';
import { LoginDto } from './dtos/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  signup(@Body() credentials: SignupDto) {
    return this.authService.signup(credentials);
  }

  @Post('login')
  login(@Body() credentials: LoginDto) {
    return this.authService.login(credentials);
  }
}
