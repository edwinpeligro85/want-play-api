import { TimestampsModel } from '@common/schemas';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { State } from './state.schema';

export type CityDocument = City & Document;

@Schema({ timestamps: true })
export class City extends TimestampsModel<City> {
  @Prop({ required: true })
  name: string;

  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: State.name,
  })
  state: State;
}

export const CitySchema = SchemaFactory.createForClass(City);
