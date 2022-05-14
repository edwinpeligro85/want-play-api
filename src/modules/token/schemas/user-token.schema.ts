import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

export type TokenDocument = Token & Document;

@Schema()
export class Token {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  uId: string;

  @Prop({ require: true })
  token: string;

  @Prop({ require: true })
  breed: Date;
}

export const TokenSchema = SchemaFactory.createForClass(Token);

TokenSchema.index({ token: 1, uId: 1 }, { unique: true });
