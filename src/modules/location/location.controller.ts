import { IsMongoIdPipe } from '@common/pipes';
import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateCityDto } from './dto/create-city.dto';
import { CreateCountryDto } from './dto/create-country.dto';
import { CreateStateDto } from './dto/create-state.dto';
import { LocationService } from './location.service';
import { City, Country, State } from './schemas';

@ApiTags('Location')
@Controller('location')
export class LocationController {
  constructor(private readonly _location: LocationService) {}

  @Post('/country')
  createCountry(@Body() createCountryDto: CreateCountryDto): Promise<Country> {
    return this._location.createCountry(createCountryDto);
  }

  @Get('/country')
  findAllCountries(): Promise<Country[]> {
    return this._location.findAllCountries();
  }

  @Get('/country/:id/states')
  findAllCountryStates(
    @Param('id', IsMongoIdPipe) id: string,
  ): Promise<Country[]> {
    return this._location.findAllStates(id);
  }

  @Post('/state')
  createState(@Body() createStateDto: CreateStateDto): Promise<State> {
    return this._location.createState(createStateDto);
  }

  @Get('/state')
  findAllStates(): Promise<State[]> {
    return this._location.findAllStates();
  }

  @Get('/state/:id/cities')
  findAllStateCities(@Param('id', IsMongoIdPipe) id: string): Promise<City[]> {
    return this._location.findAllCities(id);
  }

  @Post('/city')
  createCity(@Body() createCityDto: CreateCityDto): Promise<City> {
    return this._location.createCity(createCityDto);
  }

  @Get('/city')
  findAllCities(): Promise<City[]> {
    return this._location.findAllCities();
  }
}
