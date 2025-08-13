// src/email/email.service.ts
import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class EmailService {
  constructor(private readonly mailerService: MailerService) {}

//   async sendEmail(to: string, subject: string, text: string) {
//     await this.mailerService.sendMail({
//       to,
//       subject,
//       text,  // Plain text body
//       // html: `<p>${text}</p>`  // Uncomment for HTML support
//     });
//   }

async sendEmail(to: string, subject: string, text: string) {
  console.log('Sending email with details:', { to, subject });
  
  try {
    const result = await this.mailerService.sendMail({
      to,
      subject,
      text,
    });
    
    console.log('Email sent successfully:', result);
    return result;
  } catch (error) {
    console.error('SMTP Error details:', {
      code: error.code,
      response: error.response,
      responseCode: error.responseCode
    });
    throw error;
  }
}
}