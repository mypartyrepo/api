import { BadRequestException, Injectable } from '@nestjs/common';
import { SignupDto } from './dtos/signup.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/User.schema';
import { Model } from 'mongoose';
import { hash } from 'bcryptjs';

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
}
