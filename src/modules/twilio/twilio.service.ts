import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Twilio } from 'twilio';

@Injectable()
class TwilioService {
  private client: Twilio;

  constructor(private configService: ConfigService) {
    const accountSid = this.configService.get<string>('twilio.accountSID');
    const authToken = this.configService.get<string>('twilio.authToken');

    if (!accountSid || !authToken) {
      throw new Error('Twilio account SID or auth token is not defined');
    }

    this.client = new Twilio(accountSid, authToken);
  }

  async sendSms(to: string, body: string) {
    const from = this.configService.get<string>('twilio.phoneNumber');
    if (!from) {
      throw new Error('Twilio phone number is not defined');
    }

    return this.client.messages.create({ to, from, body });
  }
}

export default TwilioService;
