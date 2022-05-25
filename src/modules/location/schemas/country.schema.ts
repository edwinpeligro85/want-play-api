import { TimestampsModel } from '@common/schemas';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type CountryDocument = Country & Document;

@Schema({ timestamps: true })
export class Country extends TimestampsModel<Country> {
  @Prop({ required: true })
  name: string;
}

export const CountrySchema = SchemaFactory.createForClass(Country);
