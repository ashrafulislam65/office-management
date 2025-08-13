 import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { EmailService } from './email.service';

@Module({
  imports: [
    MailerModule.forRoot({
  transport: {
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: 'defaultabir@gmail.com',
      pass: 'zwxf xmss eodl hbrm',
    },
    tls: {
      rejectUnauthorized: false // Add this for local testing
    }
  },
  defaults: {
    from: '"No Reply" <defaultabir@gmail.com>',
  },
  template: {
    dir: __dirname + '/templates',
    options: {
      strict: true,
    },
  },
}),
  ],
  providers: [EmailService],  // Add this line
  exports: [EmailService],    // Change from MailerModule to EmailService
})
export class EmailModule {}