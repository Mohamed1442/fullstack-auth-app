import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

export type RefreshTokenDocument = HydratedDocument<RefreshToken>;

@Schema({ collection: 'refresh_tokens' })
export class RefreshToken {
  @Prop({ type: String, required: true })
  userId: string;

  @Prop({
    type: String,
    required: true,
    unique: true,
    default: () => uuidv4(),
  })
  refreshToken: string;

  @Prop({ type: Date, default: Date.now })
  createdAt: Date;

  @Prop({ type: Date, required: true })
  expiresAt: Date;
}

export const RefreshTokenSchema = SchemaFactory.createForClass(RefreshToken);
