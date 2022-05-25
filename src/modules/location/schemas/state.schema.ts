import { TimestampsModel } from '@common/schemas';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Country } from './country.schema';

export type StateDocument = State & Document;

@Schema({ timestamps: true })
export class State extends TimestampsModel<State> {
  @Prop({ required: true })
  name: string;

  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: Country.name,
  })
  country: Country;
}

export const StateSchema = SchemaFactory.createForClass(State);
