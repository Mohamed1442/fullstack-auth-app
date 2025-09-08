import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from 'src/users/services/users.service';
import { RefreshTokenRepository } from '../repositories/refresh-token.repository';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import {
  BadRequestException,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import { ERole } from 'src/users/enum';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt', () => ({
  hash: jest.fn(),
  compare: jest.fn(),
  genSalt: jest.fn(),
}));

jest.mock('src/users/services/users.service', () => {
  return {
    UsersService: jest.fn().mockImplementation(() => ({
      findUserByEmail: jest.fn(),
      findUserById: jest.fn(),
      findAllUsersCount: jest.fn(),
      create: jest.fn(),
    })),
  };
});

jest.mock('../repositories/refresh-token.repository', () => {
  return {
    RefreshTokenRepository: jest.fn().mockImplementation(() => ({
      findOneById: jest.fn(),
      createOne: jest.fn(),
      deleteManyByUserId: jest.fn(),
    })),
  };
});

jest.mock('@nestjs/jwt', () => {
  return {
    JwtService: jest.fn().mockImplementation(() => ({
      signAsync: jest.fn(),
    })),
  };
});

jest.mock('@nestjs/config', () => {
  return {
    ConfigService: jest.fn().mockImplementation(() => ({
      getOrThrow: jest.fn().mockReturnValue('7'),
    })),
  };
});

describe('AuthService', () => {
  let service: AuthService;
  let usersService: jest.Mocked<UsersService>;
  let refreshTokenRepo: jest.Mocked<RefreshTokenRepository>;
  let jwtService: jest.Mocked<JwtService>;
  let configService: jest.Mocked<ConfigService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        UsersService,
        RefreshTokenRepository,
        JwtService,
        ConfigService,
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get(UsersService) as jest.Mocked<UsersService>;
    refreshTokenRepo = module.get(
      RefreshTokenRepository,
    ) as jest.Mocked<RefreshTokenRepository>;
    jwtService = module.get(JwtService) as jest.Mocked<JwtService>;
    configService = module.get(ConfigService) as jest.Mocked<ConfigService>;
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('should register a new user', async () => {
      usersService.findUserByEmail.mockResolvedValue(null);
      usersService.findAllUsersCount.mockResolvedValue(0);
      usersService.create.mockResolvedValue({
        _id: '1',
        email: 'test@test.com',
        name: 'Test',
        role: ERole.ADMIN,
      } as any);
      jwtService.signAsync.mockResolvedValueOnce('access-token');
      refreshTokenRepo.createOne.mockResolvedValue({
        refreshToken: 'refresh-token',
      } as any);

      const result = await service.register({
        email: 'test@test.com',
        password: '123456',
        name: 'Test',
      });

      expect(result).toEqual({
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
      });
    });

    it('should throw if user already exists', async () => {
      usersService.findUserByEmail.mockResolvedValue({ id: 1 } as any);

      await expect(
        service.register({
          email: 'test@test.com',
          password: '123456',
          name: 'Test',
        }),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('login', () => {
    it('should throw if user not found', async () => {
      usersService.findUserByEmail.mockResolvedValue(null);

      await expect(
        service.login({ email: 'test@test.com', password: '123' }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw if password does not match', async () => {
      usersService.findUserByEmail.mockResolvedValue({
        password: 'hashed',
      } as any);

      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(
        service.login({ email: 'test@test.com', password: '1234' }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should return tokens if credentials are valid', async () => {
      usersService.findUserByEmail.mockResolvedValue({
        _id: '1',
        email: 'test@test.com',
        password: 'some-hashed-passord',
        name: 'Omar',
        role: ERole.USER,
      } as any);

      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      jwtService.signAsync.mockResolvedValue('access-token');
      refreshTokenRepo.createOne.mockResolvedValue({
        refreshToken: 'refresh-token',
      } as any);

      const res = await service.login({
        email: 'test@test.com',
        password: '123',
      });

      expect(res).toEqual({
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
      });
    });
  });

  describe('getNewRefreshToken', () => {
    it('should throw if no old token provided', async () => {
      await expect(service.getNewRefreshToken('')).rejects.toThrow(
        ForbiddenException,
      );
    });

    it('should throw if refresh token not found', async () => {
      refreshTokenRepo.findOneById.mockResolvedValue(null);

      await expect(service.getNewRefreshToken('old-token')).rejects.toThrow(
        ForbiddenException,
      );
    });

    it('should throw if user not found', async () => {
      refreshTokenRepo.findOneById.mockResolvedValue({ userId: '1' } as any);
      usersService.findUserById.mockResolvedValue(null);

      await expect(service.getNewRefreshToken('old-token')).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should return new tokens', async () => {
      refreshTokenRepo.findOneById.mockResolvedValue({
        id: 'rt1',
        userId: '1',
      } as any);
      usersService.findUserById.mockResolvedValue({
        _id: '1',
        email: 'test@test.com',
        name: 'Mohamed',
        role: ERole.USER,
      } as any);
      jwtService.signAsync.mockResolvedValue('access-token');
      refreshTokenRepo.createOne.mockResolvedValue({
        refreshToken: 'refresh-token',
      } as any);

      const res = await service.getNewRefreshToken('old-token');
      expect(res).toEqual({
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
      });
    });
  });
});
