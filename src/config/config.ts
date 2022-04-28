import { ConfigModule } from '@nestjs/config';
import configuration from './configuration';

export const Configuration = ConfigModule.forRoot({
  load: [configuration],
  isGlobal: true,
  cache: true,
  expandVariables: true,
});
