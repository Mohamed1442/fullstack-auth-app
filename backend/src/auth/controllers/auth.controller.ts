import {
  Body,
  Controller,
  Post,
  Req,
  Res,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { Request, Response } from 'express';
import ms from 'ms';
import { AccessTokenGuard } from 'src/global/guards';
import { TransactionInterceptor } from 'src/global/interceptors';
import { ResponseBuilder } from 'src/global/utilities';
import { LoginRequestDto } from '../dtos/requests';
import { SignupRequestDto } from '../dtos/requests/signup.request.dto';
import { LoginResponseDto } from '../dtos/responses';
import { AuthService } from '../services';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { ApiSingleDataResponse } from 'src/global/decorators';

@Controller('auth')
@UseInterceptors(TransactionInterceptor)
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  @Post('register')
  @ApiOperation({ summary: 'Registeration for new user' })
  @ApiSingleDataResponse(LoginResponseDto)
  async register(
    @Body() signupRequestDto: SignupRequestDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const tokens = await this.authService.register(signupRequestDto);

    // set refresh token in cookie
    res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: this.configService.getOrThrow('NODE_ENV') !== 'local',
      sameSite: 'none',
      maxAge: +ms(
        this.configService.getOrThrow('JWT_REFRESH_TOKEN_EXPIRE_TIME_STRING'),
      ),
    });

    return ResponseBuilder.buildSingle(new LoginResponseDto(tokens));
  }

  @Post('login')
  @ApiOperation({ summary: 'User login' })
  @ApiSingleDataResponse(LoginResponseDto)
  async login(
    @Body() loginRequestDto: LoginRequestDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const tokens = await this.authService.login(loginRequestDto);

    // set refresh token in cookie
    res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: this.configService.getOrThrow('NODE_ENV') !== 'local',
      sameSite: 'none',
      maxAge: +ms(
        this.configService.getOrThrow('JWT_REFRESH_TOKEN_EXPIRE_TIME_STRING'),
      ),
    });

    return ResponseBuilder.buildSingle(new LoginResponseDto(tokens));
  }

  @Post('refresh-access-token')
  @ApiOperation({ summary: 'Get new access token' })
  @ApiSingleDataResponse(LoginResponseDto)
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const oldRefreshToken = req.cookies?.refreshToken;

    const tokens = await this.authService.getNewRefreshToken(oldRefreshToken);

    // set refresh token in cookie
    res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: this.configService.getOrThrow('NODE_ENV') !== 'local',
      sameSite: 'none',
      maxAge: +ms(
        this.configService.getOrThrow('JWT_REFRESH_TOKEN_EXPIRE_TIME_STRING'),
      ),
    });

    return ResponseBuilder.buildSingle(new LoginResponseDto(tokens));
  }

  @Post('logout')
  @ApiOperation({ summary: 'Logout user' })
  @UseGuards(AccessTokenGuard)
  @ApiBearerAuth()
  async logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('refreshToken', {
      sameSite: 'none',
      secure: this.configService.getOrThrow('NODE_ENV') !== 'local',
      httpOnly: true,
    });

    return { message: 'Cookie cleared' };
  }
}
