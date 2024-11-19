import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { SignupDto } from './dtos/signup.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/User.schema';
import { Model } from 'mongoose';
import { compare, hash } from 'bcryptjs';
import { LoginDto } from './dtos/login.dto';
import { ChangePasswordDto } from './dtos/change-password.dto';
import { ForgotPasswordDto } from './dtos/forgot-password.dto';
import { nanoid } from 'nanoid';
import { ResetToken } from './schemas/reset-token.schema';
import { MailService } from 'src/services/mail.service';
import { JwtService } from '@nestjs/jwt';
import { RefreshToken } from './schemas/refresh-token.schema';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private UserModel: Model<User>,
    @InjectModel(RefreshToken.name)
    private RefreshTokenModel: Model<RefreshToken>,
    @InjectModel(ResetToken.name) private ResetTokenModel: Model<ResetToken>,
    private mailService: MailService,
    private jwtService: JwtService,
  ) {}

  async signup(credentials: SignupDto) {
    const { name, username, email, password } = credentials;

    const usernameInUse = await this.UserModel.findOne({ username });
    if (usernameInUse) throw new BadRequestException('Username já em uso');

    const emailInUse = await this.UserModel.findOne({ email });
    if (emailInUse) throw new BadRequestException('Email já em uso');

    const hashedPassword = await hash(password, 10);

    await this.UserModel.create({
      name,
      username,
      email,
      password: hashedPassword,
    });

    const message = 'Cadastro realizado com sucesso!';

    return { credentials, message };
  }

  async login(credentials: LoginDto) {
    const { username, email, password } = credentials;

    let user: User;

    if (username) user = await this.UserModel.findOne({ username });
    else user = await this.UserModel.findOne({ email });

    if (!user) throw new BadRequestException('Credenciais incorretas');

    const passwordMatch = await compare(password, user.password);
    if (!passwordMatch) throw new BadRequestException('Credenciais incorretas');

    const tokens = await this.generateUserTokens(user._id);

    return { ...tokens, userId: user._id };
  }

  async refreshTokens(refreshToken: string) {
    const token = await this.RefreshTokenModel.findOne({
      token: refreshToken,
      expiryDate: { $gte: new Date() },
    });

    if (!token) {
      throw new UnauthorizedException('Refresh Token is invalid');
    }
    return this.generateUserTokens(token.userId);
  }

  async changePassword(credentials: ChangePasswordDto) {
    const { userId, username, email, password, newPassword } = credentials;

    let user: User;

    if (username) user = await this.UserModel.findOne({ username });
    else if (email) user = await this.UserModel.findOne({ email });
    else user = await this.UserModel.findById(userId);

    if (!user) throw new BadRequestException('Wrong credentials');

    const passwordMatch = await compare(password, user.password);
    if (!passwordMatch) throw new BadRequestException('Wrong credentials');

    const newHashedPassword = await hash(newPassword, 10);
    user.password = newHashedPassword;

    await user.save();

    return { userId: user._id, ...credentials };
  }

  async forgotPassword(credentials: ForgotPasswordDto) {
    const { username, email } = credentials;

    let user: User;

    if (username) user = await this.UserModel.findOne({ username });
    else user = await this.UserModel.findOne({ email });

    if (!user) throw new BadRequestException('Wrong credentials');
    else {
      const expiryDate = new Date();
      expiryDate.setHours(expiryDate.getHours() + 1);

      const resetToken = nanoid(64);

      await this.ResetTokenModel.create({
        token: resetToken,
        userId: user._id,
        expiryDate,
      });

      this.mailService.sendPasswordResetEmail(user.email, resetToken);
    }

    return { message: 'Email sent' };
  }

  async generateUserTokens(userId) {
    const accessToken = this.jwtService.sign({ userId }, { expiresIn: '1h' });
    const refreshToken = uuidv4();

    await this.storeRefreshToken(refreshToken, userId);

    return { accessToken, refreshToken };
  }

  async storeRefreshToken(token: string, userId: string) {
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 3);

    await this.RefreshTokenModel.updateOne(
      { userId },
      { $set: { expiryDate, token } },
      { upsert: true },
    );
  }
}
