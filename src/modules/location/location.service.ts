import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateCityDto } from './dto/create-city.dto';
import { CreateCountryDto } from './dto/create-country.dto';
import { CreateStateDto } from './dto/create-state.dto';
import {
  City,
  CityDocument,
  Country,
  CountryDocument,
  State,
  StateDocument,
} from './schemas';

@Injectable()
export class LocationService {
  constructor(
    @InjectModel(City.name) private cityModel: Model<CityDocument>,
    @InjectModel(State.name) private stateModel: Model<StateDocument>,
    @InjectModel(Country.name) private countryModel: Model<CountryDocument>,
  ) {}

  async createCountry({ name }: CreateCountryDto): Promise<Country> {
    const country = await this.countryModel.findOne({ name }).exec();
    if (country) return country as any;

    return new this.countryModel({ name }).save();
  }

  async createState({ name, country }: CreateStateDto): Promise<State> {
    if (!(await this.countryModel.exists({ _id: country }).exec())) {
      throw new BadRequestException(`Not exist country ${country}`);
    }

    const state = await this.stateModel.findOne({ name, country }).exec();
    if (state) return state as any;

    return new this.stateModel({ name, country }).save();
  }

  async createCity({ name, state }: CreateCityDto): Promise<City> {
    if (!(await this.stateModel.exists({ _id: state }).exec())) {
      throw new BadRequestException(`Not exist state ${state}`);
    }

    const city = await this.cityModel.findOne({ name, state }).exec();
    if (city) return city as any;

    return new this.cityModel({ name, state }).save();
  }

  async findAllCountries(): Promise<Country[]> {
    return this.countryModel.find().exec();
  }

  async findAllStates(country?: string): Promise<State[]> {
    if (country) {
      return this.stateModel.find({ country }).exec();
    }

    return this.stateModel.find().exec();
  }

  async findAllCities(state?: string): Promise<City[]> {
    if (state) {
      return this.cityModel.find({ state }).exec();
    }

    return this.cityModel.find().exec();
  }

  async cityExists(_id: string): Promise<boolean> {
    return (await this.cityModel.exists({ _id }).exec()) !== null;
  }
}
