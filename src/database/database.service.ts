import { ConfigModule, ConfigService } from '@nestjs/config';
import { join } from 'path';
import { Config } from '@config';
import { DataBaseEnvironment } from '@interfaces';
import { MongooseModule } from '@nestjs/mongoose';

export const databaseProvider = [
  MongooseModule.forRootAsync({
    imports: [ConfigModule],
    inject: [ConfigService],
    useFactory: async (_config: ConfigService) => {
      const db = _config.get<DataBaseEnvironment>(Config.DATABASE);

      return {
        uri: `mongodb+srv://${db.username}:${db.password}@${db.host}/${db.name}?retryWrites=true&w=majority`,
      };
    },
  }),
  // TypeOrmModule.forRootAsync({
  //   imports: [ConfigModule],
  //   inject: [ConfigService],
  //   useFactory: async (_config: ConfigService) => {
  //     const db = _config.get<DataBaseEnvironment>(Config.DATABASE);

  //     return {
  //       type: 'mongodb',
  //       url: `mongodb+srv://${db.username}:${db.password}@${db.host}/${db.name}?retryWrites=true`,
  //       entities: [join(__dirname, '../**/**/*entity{.ts,.js}')],
  //       // migrations: [join(__dirname, '/migrations/*{.ts,.js}')],
  //       synchronize: !_config.get<boolean>(Config.PRODUCTION),
  //       autoLoadEntities: true,
  //       useNewUrlParser: true,
  //       useUnifiedTopology: true,
  //       logging: ['error', 'schema', 'migration'],
  //       logger: 'file',
  //     };
  //   },
  // }),
];
