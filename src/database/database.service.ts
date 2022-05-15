import { ConfigModule, ConfigService } from '@nestjs/config';
import { DataBaseEnvironment, Environment } from '@interfaces';
import { MongooseModule } from '@nestjs/mongoose';

export const databaseProvider = [
  MongooseModule.forRootAsync({
    imports: [ConfigModule],
    inject: [ConfigService],
    useFactory: async (_config: ConfigService<Environment>) => {
      const db = _config.get<DataBaseEnvironment>('database');

      return {
        uri: `mongodb+srv://${db.username}:${db.password}@${db.host}/${db.name}?retryWrites=true&w=majority`,
      };
    },
  }),
];
