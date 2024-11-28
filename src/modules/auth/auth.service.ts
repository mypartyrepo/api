import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { SignupDto } from './dtos/signup.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/User.schema';
import { Model } from 'mongoose';
import { compare, hash } from 'bcryptjs';
import { LoginDto } from './dtos/login.dto';
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
    const { name, username, email, password, phone } = credentials;

    const usernameInUse = await this.UserModel.findOne({ username });
    if (usernameInUse) throw new BadRequestException('Username já em uso');

    const emailInUse = await this.UserModel.findOne({ email });
    if (emailInUse) throw new BadRequestException('Email já em uso');

    const hashedPassword = await hash(password, 10);

    await this.UserModel.create({
      name,
      username,
      phone,
      email,
      password: hashedPassword,
      subscription: false,
    });

    const message = 'Cadastro realizado com sucesso!';

    return { message };
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

    return { ...tokens, userId: user._id, name: user.name };
  }

  async findUser(id: string) {
    const user = await this.UserModel.findById(id);

    const plainUser = user.toObject();
    const newUser = Object.fromEntries(
      Object.entries(plainUser).filter(([key]) => key !== 'password'),
    );

    return newUser;
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

  async changePassword(userId, oldPassword: string, newPassword: string) {
    const user = await this.UserModel.findById(userId);
    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    const passwordMatch = await compare(oldPassword, user.password);
    if (!passwordMatch) {
      throw new UnauthorizedException('Credenciais incorretas');
    }

    const newHashedPassword = await hash(newPassword, 10);
    user.password = newHashedPassword;
    await user.save();
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

      //this.mailService.sendPasswordResetEmail(user.email, resetToken);
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
