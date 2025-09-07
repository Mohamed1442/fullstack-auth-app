import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User, UserDocument } from '../schemas/user.schema';
import { SignupRequestDto } from 'src/auth/dtos/requests/signup.request.dto';
import { ISignup } from '../interfaces';
import { PageOptionsDto } from 'src/global/dtos';

@Injectable()
export class UsersRepository {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async findAllCount(): Promise<number> {
    return this.userModel.countDocuments().exec();
  }

  async findAll(pageOptionsDto?: PageOptionsDto): Promise<UserDocument[]> {
    const page = pageOptionsDto?.page ?? 1;
    const limit = pageOptionsDto?.take ?? 10;

    return this.userModel
      .find()
      .skip((page - 1) * limit)
      .limit(limit)
      .exec();
  }

  async findById(id: string): Promise<UserDocument | null> {
    return this.userModel.findById(id).exec();
  }

  async findByEmail(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email }).exec();
  }

  async create(user: ISignup): Promise<UserDocument> {
    const newUser = new this.userModel(user);
    return newUser.save();
  }

  async deleteById(id: string): Promise<UserDocument | null> {
    return this.userModel.findByIdAndDelete(id).exec();
  }
}
