import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { add } from 'date-fns';
import { ERole } from 'src/users/enum';
import { UserDocument } from 'src/users/schemas';
import { UsersService } from 'src/users/services';
import { LoginRequestDto } from '../dtos/requests';
import { SignupRequestDto } from '../dtos/requests/signup.request.dto';
import { ITokens } from '../interfaces';
import { RefreshTokenRepository } from '../repositories';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly refreshTokenRepository: RefreshTokenRepository,
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async register(signupRequestDto: SignupRequestDto): Promise<ITokens> {
    this.logger.log(
      `Registration attempt for email: ${signupRequestDto.email}`,
    );

    const existingUser = await this.userService.findUserByEmail(
      signupRequestDto.email,
    );

    if (existingUser) {
      throw new BadRequestException(
        'Email already in use. Please use a different email address.',
      );
    }

    const role = await this.getUserRole();

    const hashedPassword = await this.hashPassword(signupRequestDto.password);

    const createdUser = await this.userService.create({
      ...signupRequestDto,
      password: hashedPassword,
      role,
    });

    const { accessToken, refreshToken } =
      await this.buildUserTokenResponse(createdUser);

    return {
      accessToken,
      refreshToken,
    };
  }

  async login(loginRequestDto: LoginRequestDto): Promise<ITokens> {
    const { email, password } = loginRequestDto;

    const user = await this.userService.findUserByEmail(email);

    if (!user) {
      throw new UnauthorizedException(
        'Invalid email or password. Please check your credentials and try again.',
      );
    }

    const doesPasswordMatch = await this.comparePassword(
      password,
      user.password,
    );

    if (!doesPasswordMatch) {
      throw new UnauthorizedException(
        'Invalid email or password. Please check your credentials and try again.',
      );
    }

    this.logger.log(`Login successful for email: ${email}`);

    // revoke all refresh tokens of the user
    await this.revokeAllRefreshTokensOfUser(user._id.toString());

    this.logger.log(
      `Revoked all previous refresh tokens for userId: ${user._id.toString()}`,
    );

    const res = await this.buildUserTokenResponse(user);

    return res;
  }

  async getNewRefreshToken(oldRefreshToken: string): Promise<ITokens> {
    if (!oldRefreshToken) {
      throw new ForbiddenException(
        'Unable to refresh token. Please log in again.',
      );
    }

    const refreshTokenToFind =
      await this.refreshTokenRepository.findOneById(oldRefreshToken);

    if (!refreshTokenToFind) {
      throw new ForbiddenException(
        'Unable to refresh token. Please log in again.',
      );
    }

    const userFound = await this.userService.findUserById(
      refreshTokenToFind.userId,
    );

    if (!userFound) {
      throw new BadRequestException(
        'Associated user not found. Please log in again.',
      );
    }

    // revoke the old refresh token
    await this.revokeAllRefreshTokensOfUser(refreshTokenToFind.id);

    const { accessToken, refreshToken } =
      await this.buildUserTokenResponse(userFound);

    return { accessToken, refreshToken };
  }

  private async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
  }

  private async getUserRole(): Promise<ERole> {
    const userCount = await this.userService.findAllUsersCount();
    return userCount === 0 ? ERole.ADMIN : ERole.USER;
  }

  private async comparePassword(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    const isMatch = await bcrypt.compare(password, hashedPassword);
    return isMatch;
  }

  private async revokeAllRefreshTokensOfUser(userId: string): Promise<void> {
    await this.refreshTokenRepository.deleteManyByUserId(userId);
  }

  private async buildUserTokenResponse(user: UserDocument): Promise<ITokens> {
    const refreshTokenExpireTime = this.configService.getOrThrow<string>(
      'JWT_REFRESH_TOKEN_EXPIRE_TIME_STRING',
    );

    const { _id, email, name, role } = user;
    const id = _id.toString();

    const refreshTokenExpireAt = add(new Date(), {
      days: parseInt(refreshTokenExpireTime, 10),
    });

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync({
        id,
        name,
        email,
        role,
      }),
      this.refreshTokenRepository.createOne(id, refreshTokenExpireAt),
    ]);

    return {
      accessToken,
      refreshToken: refreshToken.refreshToken,
    };
  }
}
