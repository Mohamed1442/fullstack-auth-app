import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { NotFoundException } from '@nestjs/common';
import { UsersRepository } from '../repositories/users.repository';

jest.mock('../repositories/users.repository', () => {
  return {
    UsersRepository: jest.fn().mockImplementation(() => ({
      findAllCount: jest.fn(),
      findAll: jest.fn(),
      findByEmail: jest.fn(),
      findById: jest.fn(),
      create: jest.fn(),
      deleteById: jest.fn(),
    })),
  };
});

describe('UsersService', () => {
  let service: UsersService;
  let repo: jest.Mocked<UsersRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService, UsersRepository], // no need to provide manually, jest.mock already overrides it
    }).compile();

    service = module.get<UsersService>(UsersService);
    repo = module.get(UsersRepository) as jest.Mocked<UsersRepository>;
  });

  it('should return count', async () => {
    repo.findAllCount.mockResolvedValue(5);
    expect(await service.findAllUsersCount()).toBe(5);
  });

  it('should find all users', async () => {
    repo.findAll.mockResolvedValue([{ id: 1 } as any]);
    expect(await service.findAllUsers()).toEqual([{ id: 1 }]);
  });

  it('should find user by email', async () => {
    repo.findByEmail.mockResolvedValue({ id: 1 } as any);
    expect(await service.findUserByEmail('a')).toEqual({ id: 1 });
  });

  it('should throw if deleting non-existing user', async () => {
    repo.deleteById.mockResolvedValue(null);
    await expect(service.deleteUserById('x')).rejects.toThrow(
      NotFoundException,
    );
  });

  it('should delete existing user', async () => {
    repo.deleteById.mockResolvedValue({ id: 1 } as any);
    expect(await service.deleteUserById('x')).toEqual({ id: 1 });
  });
});
