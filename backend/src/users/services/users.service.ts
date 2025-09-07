import { Injectable, NotFoundException } from '@nestjs/common';
import { UsersRepository } from '../repositories';
import { User, UserDocument } from '../schemas';
import { SignupRequestDto } from 'src/auth/dtos/requests/signup.request.dto';
import { ISignup } from '../interfaces';
import { PageOptionsDto } from 'src/global/dtos';

@Injectable()
export class UsersService {
  constructor(private readonly userRepository: UsersRepository) {}

  async findAllUsersCount(): Promise<number> {
    return this.userRepository.findAllCount();
  }

  async findAllUsers(pageOptionsDto?: PageOptionsDto): Promise<UserDocument[]> {
    return this.userRepository.findAll(pageOptionsDto);
  }

  async findUserByEmail(email: string): Promise<UserDocument | null> {
    return this.userRepository.findByEmail(email);
  }

  async findUserById(id: string): Promise<UserDocument | null> {
    return this.userRepository.findById(id);
  }

  async create(user: ISignup): Promise<UserDocument> {
    return this.userRepository.create(user);
  }

  async deleteUserById(id: string): Promise<UserDocument> {
    const deletedUser = await this.userRepository.deleteById(id);

    if (!deletedUser) throw new NotFoundException('User not found');

    return deletedUser;
  }
}
