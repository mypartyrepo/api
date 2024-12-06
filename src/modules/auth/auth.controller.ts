import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupDto } from './dtos/signup.dto';
import { LoginDto } from './dtos/login.dto';
import { ChangePasswordDto } from './dtos/change-password.dto';
import { ForgotPasswordDto } from './dtos/forgot-password.dto';
import { RefreshTokenDto } from './dtos/refresh-tokens.dto';
import { AuthenticationGuard } from 'src/modules/auth/guards/authentication.guard';
import { ResetPasswordDto } from './dtos/reset-password.dto';
import { UpdateUserDto } from './dtos/update-user.dto';

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

  @Post('refresh')
  refresh(@Body() credentials: RefreshTokenDto) {
    return this.authService.refreshTokens(credentials.refreshToken);
  }

  @UseGuards(AuthenticationGuard)
  @Put('change-password')
  async changePassword(
    @Body() changePasswordDto: ChangePasswordDto,
    @Req() req,
  ) {
    return this.authService.changePassword(
      req.userId,
      changePasswordDto.oldPassword,
      changePasswordDto.newPassword,
    );
  }

  @Post('forgot-password')
  forgotPassword(@Body() credentials: ForgotPasswordDto) {
    return this.authService.forgotPassword(credentials);
  }

  @Put('reset-password')
  async resetPassword(@Body() credentials: ResetPasswordDto) {
    return this.authService.resetPassword(credentials);
  }

  @UseGuards(AuthenticationGuard)
  @Get('user')
  async findUser(@Req() req) {
    return await this.authService.findUser(req.userId);
  }

  @UseGuards(AuthenticationGuard)
  @Put('user')
  async updateUser(@Body() user: UpdateUserDto, @Req() req) {
    return await this.authService.updateUser(req.userId, user);
  }
}
