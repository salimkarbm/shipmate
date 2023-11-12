import dotenv from 'dotenv';
import nodemailer from 'nodemailer';
import Utility from '../helpers';

dotenv.config({ path: '.env' });

const util = new Utility();

export interface Mail {
    email: string;
    firstName?: string;
    OTP?: number | string;
    subject: string;
}

export class MalierService {
    private EmailFrom = process.env.EMAIL_FROM;

    private MAIL_HOST = process.env.MAIL_HOST;

    private MAIL_USERNAME = process.env.MAIL_USERNAME;

    private MAIL_PASSWORD = process.env.MAIL_PASSWORD;

    private SERVICE_NAME = process.env.SERVICE_NAME;

    private MAIL_PORT = process.env.MAIL_PORT;

    async sendMail(options: Mail, template: string): Promise<any> {
        // convert email in HTML to plain text
        const text = await util.convertEmailToText(template);
        const msg: any = {
            to: options.email,
            from: this.EmailFrom, // Use the email address or domain you verified above
            subject: options.subject,
            text,
            html: template
        };
        if (process.env.NODE_ENV === 'production') {
            // Config nodemailer
            const transporter = nodemailer.createTransport({
                service: this.SERVICE_NAME,
                host: this.MAIL_HOST,
                secure: true,
                port: Number(this.MAIL_PORT),
                auth: {
                    user: this.MAIL_USERNAME,
                    pass: this.MAIL_PASSWORD
                }
            });
            // send the email with nodemailer
            const result = await transporter.sendMail(msg);
            return result;
        }
        const transporter = nodemailer.createTransport({
            service: this.SERVICE_NAME,
            host: this.MAIL_HOST,
            port: Number(this.MAIL_PORT),
            auth: {
                user: this.MAIL_USERNAME,
                pass: this.MAIL_PASSWORD
            }
        });
        // send the email with nodemailer
        const result = await transporter.sendMail(msg);
        return result;
    }

    // send the OTP email
    async sendOTP(options: Mail) {
        if (options.OTP !== undefined && options.OTP.toString().length === 6) {
            const message = `
            <div style=" font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px; border-radius: 10px; box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.1);">

            <h2 style="text-align: center; color: #007bff;">${options.subject}</h2>
    
            <p>Hello,</p>
    
            <p>Welcome to <strong>Shipmate</strong>. Please verify your email address with the OTP code below. It would expire after 10 minutes.</p>
    
            <p>OTP: <strong>${options.OTP}</strong></p>
    
            <p>If you didn't request this, please ignore this email.</p>
    
            <p>Best Regards,
            <br>Shipmate Team</p>
         </div>`;
            const result = await this.sendMail(options, message);
            return result;
        }
    }

    // Email Activation Email
    async accountActivationMail(options: Mail) {
        const message = `
        <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px; border-radius: 10px; box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.1);">

        <h2 style="text-align: center; color: #007bff;">${options.subject}</h2>
        <p  background-color: #f4f4f4; padding: 20px; text-align: center;">
        Welcome to <strong>Shipmate</strong>,
         your account has been activated. Kindly login to continue.
    </p>
    <p>Best Regards,
            <br>Shipmate Team</p>
            </div>`;
        const result = await this.sendMail(options, message);
        return result;
    }

    // Admin invite Notification
    async createAdminMail(options: Mail, adminPassword: string) {
        const message = `<p>Welcome to BCA-HEALTHCARE.</p>
        <p>You've been invited to join the BCA-HEALTHCARE platform in an administrative capacity.
         To access your account, kindly log in using the provided password: 
        ${adminPassword}, along with your email address. For enhanced security, 
        we recommend updating your password to a unique combination known only to you.</p>

        <p>Best regards,<br>
        The BCA-HEALTHCARE Team<p>`;
        const result = await this.sendMail(options, message);
        return result;
    }

    // Forget password Notification Email
    async forgotPasswordMail(options: Mail) {
        if (options.OTP !== undefined && options.OTP.toString().length === 6) {
            const message = `
            <div style=" font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px; border-radius: 10px; box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.1);">

            <h2 style="text-align: center; color: #007bff;">${options.subject}</h2>
            <p>Hi ${options.firstName}, <br> 
        <p>We received a request to reset your password, to reset your password use the code below and follow the instructions.<br> 
        <p>Code: ${options.OTP}</p><br>

       <p>If you didn't request this, please ignore this email.
        </p>
        Best regards,  <br> 
        Team Shipmate <p/>
        </div>`;
            const result = await this.sendMail(options, message);
            return result;
        }
    }

    // Reset Password Notification Email
    async resetPasswordMail(options: Mail) {
        const message = `<p>
    Hi, <br> 
    You have successfully reset your password.
      <br> 
    Team BCA-HEALTHCARE <p/>`;
        const result = await this.sendMail(options, message);
        return result;
    }
}
