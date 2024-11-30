// mail.service.ts
import * as nodemailer from 'nodemailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: 'leleosous4@gmail.com',
        pass: 'aqli zhqg pobj nqdc',
      },
    });
  }

  async sendPasswordResetEmail(recipient: string, token: string) {
    const resetLink = `http://myparty.com/reset-password?token=${token}`;
    const mailOptions = {
      from: 'MyParty',
      to: recipient,
      subject: 'Recuperação de senha',
      html: `<p>Seu link de recuperação de senha é ${resetLink}</p>`,
    };

    await this.transporter.sendMail(mailOptions);
  }
}
