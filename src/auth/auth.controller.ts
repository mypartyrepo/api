import { Body, Controller, Post, Put } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupDto } from './dtos/signup.dto';
import { LoginDto } from './dtos/login.dto';
import { ChangePasswordDto } from './dtos/change-password.dto';
import { ForgotPasswordDto } from './dtos/forgot-password.dto';

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

  @Put('change-password')
  changePassword(@Body() credentials: ChangePasswordDto) {
    return this.authService.changePassword(credentials);
  }

  @Post('forgot-password')
  forgotPassword(@Body() credentials: ForgotPasswordDto) {
    return this.authService.forgotPassword(credentials);
  }
}
