import { Module } from '@nestjs/common';
import { mailProvider } from './mail.service';

@Module({
  imports: [mailProvider],
  exports: [mailProvider],
})
export class MailModule {}
