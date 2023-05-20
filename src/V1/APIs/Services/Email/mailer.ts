import dotenv from 'dotenv';
import nodemailer from 'nodemailer';
import { htmlToText } from 'html-to-text';

dotenv.config({ path: './src/V1/APIs/Config/.env' });

const {
    SERVICE_NAME,
    MAILER_HOST,
    MAILER_USERNAME,
    MAILER_PASSWORD,
    EMAIL_FROM,
    MAILER_PORT,
    GMAIL_USERNAME,
    GMAIL_PASSWORD,
    GMAIL_HOST,
    GMAIL_PORT
} = process.env;

export interface Mail {
    email: string;
    firstName: string;
    subject: string;
    code?: number;
}

export default class Email {
    private baseUrl = process.env.BASE_URL;

    async sendEmail(options: Mail, message: string) {
        const text = htmlToText(message);
        // define the email options
        const mailOptions = {
            from: EMAIL_FROM,
            to: options.email,
            subject: options.subject,
            text,
            html: message,
        };
        // create a transporter
        if (process.env.NODE_ENV === 'production') {
            const transporter = nodemailer.createTransport({
                service: SERVICE_NAME,
                host: GMAIL_HOST,
                port: Number(GMAIL_PORT),
                auth: {
                    user: GMAIL_USERNAME,
                    pass: GMAIL_PASSWORD,
                },
            });

            // send the email with nodemailer
            return await transporter.sendMail(mailOptions);
        } else {
            const transporter = nodemailer.createTransport({
                host: MAILER_HOST as string,
                port: Number(MAILER_PORT),
                auth: {
                    user: MAILER_USERNAME,
                    pass: MAILER_PASSWORD,
                },
                tls: { rejectUnauthorized: false },
            });
            // send the email with nodemailer
            return await transporter.sendMail(mailOptions);
        }
    }

    async sendOTP(options: Mail) {
        const message = `<p>Hello ${options.firstName},</p>
        <p>Welcome to Shipmate. Please verify your 
        email address with the OTP code below. It would expire after 10mins.<p>
        <p>OTP: <b>${options.code}</b></p>`;
        return await this.sendEmail(options, message);
    }

    async sendWelcome(options: Mail) {
        const message = `<p>Welcome to Ubefu ${options.firstName},
        your account have been activated. Kindly login to continue<p>`;
        return await this.sendEmail(options, message);
    }

    async sendForgotPassword(options: Mail) {
        const title = 'password-reset/';
        const link = `${this.baseUrl}${title}${options.code}`;
        const message = `<p> Hi
        ${options.firstName}, <br> 
        We received a request to reset your password.<br>
        To reset your password, use the code below and follow the instructions.<br> 
        Code: ${options.code}<br>
        or copy and paste the link below into your browser:<br>
        ${link}
        <br> 
        If you didn't request this, please ignore this email. Your password won't change until you access the link above and create a new one.
        <br> 
        Thanks,  <br> 
        Team Shipmate <p/>`;
        return await this.sendEmail(options, message);
    }

    async sendResetSuccess(options: Mail) {
        const message = `<p>
    Hi ${options.firstName}, <br> 
    You have successfully reset your password.
      <br> 
    Team Shipmate <p/>`;
        return await this.sendEmail(options, message);
    }

    async sendLoginConfirmation(options: Mail) {
        const newDate = () => {
            const currentdate = new Date();
            const datetime = `Last Sync: ${currentdate.getDate()}/${
                currentdate.getMonth() + 1
            }/${currentdate.getFullYear()} @ ${currentdate.getHours()}:${currentdate.getMinutes()}:${currentdate.getSeconds()}`;
            return datetime;
        };
        const message = `
            <p>Welcome to Shipmate ${
                options.firstName
            }, we notice you just login your account at time: ${newDate()}
            if you didn't initiate this login, please change your password now.
                someone may be trying to gain access to your account</p>`;
        return await this.sendEmail(options, message);
    }
}
