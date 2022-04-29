import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { Config } from 'src/config';
import { DataBaseEnvironment } from 'src/interfaces';

export const databaseProvider = [
  TypeOrmModule.forRootAsync({
    imports: [ConfigModule],
    inject: [ConfigService],
    useFactory: async (_config: ConfigService) => {
      const db = _config.get<DataBaseEnvironment>(Config.DATABASE);

      return {
        type: 'mongodb',
        url: `mongodb+srv://${db.username}:${db.password}@${db.host}/${db.name}?retryWrites=true`,
        entities: [join(__dirname, '../**/**/*entity{.ts,.js}')],
        // migrations: [join(__dirname, '/migrations/*{.ts,.js}')],
        synchronize: !_config.get<boolean>(Config.PRODUCTION),
        autoLoadEntities: true,
        useNewUrlParser: true,
        useUnifiedTopology: true,
        logging: ['error', 'schema', 'migration'],
        logger: 'file',
      };
    },
  }),
];
