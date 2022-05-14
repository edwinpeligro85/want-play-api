import { ConfigModule, ConfigService } from '@nestjs/config';
import { Config } from '@config';
import { MailerEnvironment } from '@interfaces';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';

export const mailProvider = MailerModule.forRootAsync({
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: async (_config: ConfigService) => {
    const {
      host,
      port,
      user,
      password: pass,
      fromName,
      fromEmail,
    } = _config.get<MailerEnvironment>(Config.MAILER);

    return {
      transport: {
        host,
        port,
        ignoreTLS: true,
        secure: false,
        auth: {
          user,
          pass,
        },
      },
      defaults: {
        from: `"${fromName}" <${fromEmail}>`,
      },
      template: {
        dir: __dirname + '/templates',
        adapter: new HandlebarsAdapter(),
        options: {
          strict: true,
        },
      },
    };
  },
});
