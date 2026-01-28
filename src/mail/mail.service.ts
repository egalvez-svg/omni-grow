import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { MAIL_FROM } from '../shared/constants/constant';

@Injectable()
export class MailService {
    constructor(
        private readonly mailerService: MailerService,
        private readonly configService: ConfigService,
    ) { }

    async sendPasswordRecovery(email: string, token: string, name: string) {
        const from = this.configService.get(MAIL_FROM);
        const url = `http://localhost:3000/reset-password?token=${token}`; // TODO: Ajustar a URL del frontend real

        await this.mailerService.sendMail({
            to: email,
            from: from,
            subject: 'Recuperación de Contraseña - Control Clima',
            template: './recovery', // Nombre del archivo .hbs sin la extensión
            context: {
                name: name,
                url: url,
                token: token,
            },
        });
    }
}
