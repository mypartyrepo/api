import { BadRequestException, Injectable } from '@nestjs/common';
import { SignupDto } from './dtos/signup.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/User.schema';
import { Model } from 'mongoose';
import { compare, hash } from 'bcryptjs';
import { LoginDto } from './dtos/login.dto';
import { ChangePasswordDto } from './dtos/change-password.dto';

@Injectable()
export class AuthService {
  constructor(@InjectModel(User.name) private UserModel: Model<User>) {}

  async signup(credentials: SignupDto) {
    const { name, username, email, password } = credentials;

    const usernameInUse = await this.UserModel.findOne({ username });
    if (usernameInUse) throw new BadRequestException('Username already in use');

    const emailInUse = await this.UserModel.findOne({ email });
    if (emailInUse) throw new BadRequestException('Email already in use');

    const hashedPassword = await hash(password, 10);

    await this.UserModel.create({
      name,
      username,
      email,
      password: hashedPassword,
    });

    return credentials;
  }

  async login(credentials: LoginDto) {
    const { username, email, password } = credentials;

    let user: User;

    if (username) user = await this.UserModel.findOne({ username });
    else user = await this.UserModel.findOne({ email });

    if (!user) throw new BadRequestException('Wrong credentials');

    const passwordMatch = await compare(password, user.password);
    if (!passwordMatch) throw new BadRequestException('Wrong credentials');

    return { userId: user._id, ...credentials };
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
}
