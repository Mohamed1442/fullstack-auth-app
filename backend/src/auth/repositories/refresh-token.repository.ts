import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RefreshToken, RefreshTokenDocument } from '../schemas';
import { DeleteResult } from 'mongodb';

@Injectable()
export class RefreshTokenRepository {
  constructor(
    @InjectModel(RefreshToken.name)
    private refreshTokenModel: Model<RefreshTokenDocument>,
  ) {}

  async findAllByUserId(userId: string): Promise<RefreshTokenDocument[]> {
    return this.refreshTokenModel.find({ userId }).exec();
  }

  async findOneById(
    refreshToken: string,
  ): Promise<RefreshTokenDocument | null> {
    return this.refreshTokenModel.findOne({ refreshToken }).exec();
  }

  async createOne(
    userId: string,
    expiresAt: Date,
  ): Promise<RefreshTokenDocument> {
    const token = new this.refreshTokenModel({
      userId,
      expiresAt,
      createdAt: new Date(),
    });
    return token.save();
  }

  async deleteManyByUserId(userId: string): Promise<DeleteResult> {
    return this.refreshTokenModel.deleteMany({ userId }).exec();
  }
}
