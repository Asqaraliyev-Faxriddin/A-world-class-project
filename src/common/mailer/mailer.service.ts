import { Injectable } from '@nestjs/common';
import { MailerService as NestMailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailerService {
    constructor(private readonly NewMailerService: NestMailerService) { }

    createEmail(email: string, subject: string, code: number) {
        this.NewMailerService.sendMail({
            to: email,
            subject: subject,
            template: 'index',
            context: {
                code
            },

        })

    }
}
