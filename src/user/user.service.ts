import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/auth/schemas/User.schema';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private UserModel: Model<User>) {}

  async findOne(id: string) {
    const user = await this.UserModel.findById(id);

    const plainUser = user.toObject();
    const newUser = Object.fromEntries(
      Object.entries(plainUser).filter(([key]) => key !== 'password'),
    );

    return newUser;
  }

  // update(id: number, updateUserDto: UpdateUserDto) {
  //   return `This action updates a #${id} user`;
  // }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
