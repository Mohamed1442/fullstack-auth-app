import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { UsersRepository } from '../repositories';
import { User, UserDocument } from '../schemas';
import { SignupRequestDto } from 'src/auth/dtos/requests/signup.request.dto';
import { ISignup } from '../interfaces';
import { PageOptionsDto } from 'src/global/dtos';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(private readonly userRepository: UsersRepository) {}

  async findAllUsersCount(): Promise<number> {
    this.logger.log(`Fetching all users count`);
    return this.userRepository.findAllCount();
  }

  async findAllUsers(pageOptionsDto?: PageOptionsDto): Promise<UserDocument[]> {
    this.logger.log(`Fetching all users`);
    return this.userRepository.findAll(pageOptionsDto);
  }

  async findUserByEmail(email: string): Promise<UserDocument | null> {
    this.logger.log(`Fetching user by email: ${email}`);
    return this.userRepository.findByEmail(email);
  }

  async findUserById(id: string): Promise<UserDocument | null> {
    this.logger.log(`Fetching user by id: ${id}`);
    return this.userRepository.findById(id);
  }

  async create(user: ISignup): Promise<UserDocument> {
    this.logger.log(`Creating user: ${JSON.stringify(user)}`);
    return this.userRepository.create(user);
  }

  async deleteUserById(id: string): Promise<UserDocument> {
    this.logger.log(`Deleting user by id: ${id}`);
    const deletedUser = await this.userRepository.deleteById(id);

    if (!deletedUser) throw new NotFoundException('User not found');

    return deletedUser;
  }
}
