import { ConfigModule, ConfigService } from '@nestjs/config';
import { Environment, MailerEnvironment } from '@interfaces';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';

export const mailProvider = MailerModule.forRootAsync({
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: async (_config: ConfigService<Environment>) => {
    const mail = _config.get<MailerEnvironment>('mailer');

    return {
      transport: {
        host: mail.host,
        port: mail.port,
        ignoreTLS: true,
        secure: false,
        auth: {
          user: mail.user,
          pass: mail.password,
        },
      },
      defaults: {
        from: `"${mail.fromName}" <${mail.fromEmail}>`,
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
