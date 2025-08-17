// src/mail/mail.module.ts
import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { MailService } from './mail.service';

@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        host: process.env.MAIL_HOST || 'smtp.example.com',
        port: parseInt(process.env.MAIL_PORT || '587'),
        secure: false,
        auth: {
          user: process.env.MAIL_USER || 'user@example.com',
          pass: process.env.MAIL_PASSWORD || 'password',
        },
      },
      defaults: {
        from: `"Office Management" <${process.env.MAIL_FROM || 'noreply@example.com'}>`,
      },
    }),
  ],
  providers: [MailService],
  exports: [MailService], // এই লাইনটি গুরুত্বপূর্ণ
})
export class MailModule {}