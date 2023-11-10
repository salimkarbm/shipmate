import twilio from 'twilio';
import logger from '../Logger/index';

export default class SMS {
    // Configure Twilio
    twilioConfig = {
        accountSid: process.env.TWILIO_ACCOUNT_SID,
        authToken: process.env.TWILIO_AUTH_TOKEN,
        fromPhoneNumber: process.env.YOUR_TWILIO_PHONE_NUMBER
    };

    // function to send mobile notification
    public async sendMobileNotification(user: any, message: any) {
        const client = twilio(
            this.twilioConfig.accountSid,
            this.twilioConfig.authToken
        );

        try {
            const notification = await client.messages.create({
                body: message,
                from: this.twilioConfig.fromPhoneNumber,
                to: user.mobile // Assuming user.mobile contains the user's mobile number
            });

            console.log('Mobile notification sent:', notification.sid);
        } catch (err) {
            logger.error('Error sending mobile notification:', err);
        }
    }
}
