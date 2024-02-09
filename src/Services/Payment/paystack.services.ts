import { Request, Response, NextFunction } from 'express';
import axios from 'axios';
import crypto from 'crypto';
import AppError from '../../Utils/Errors/appError';
import { statusCode } from '../../Utils/HttpStatusCode/httpStatusCode';
import { walletService } from '../index';
import { userRepository } from '../../Repository';

export class PaystackService {
    private PAYSTACK_SECERT_KEY = process.env.PAYSTACK_SECERT_KEY;

    private PAYSTACK_API_URL = 'https://api.paystack.co/transaction/initialize';

    public async initializePaystackPayment(
        req: Request,
        next: NextFunction
    ): Promise<any> {
        const { userId, email } = req.user;
        const user: any = await userRepository.findUserById(userId as string);
        if (!user.wallets.walletId) {
            return next(
                new AppError('Wallet not found', statusCode.badRequest())
            );
        }
        if (userId) {
            const transactionDetails = {
                email,
                amount: req.body.amount * 100,
                metadata: {
                    userId,
                    walletId: user.wallets.walletId,
                    transactionType: 'Credit',
                    transactionStatus: 'Complete'
                }
            };
            if (transactionDetails.amount <= 0) {
                return next(
                    new AppError(
                        'Invalid transaction details',
                        statusCode.badRequest()
                    )
                );
            }
            const response = await axios.post(
                `${this.PAYSTACK_API_URL}`,
                transactionDetails,
                {
                    headers: {
                        Authorization: `Bearer ${this.PAYSTACK_SECERT_KEY}`,
                        'Content-Type': 'application/json'
                    }
                }
            );
            if (response && response.data.status !== true) {
                return next(
                    new AppError(
                        `Paystack API error: ${response.data.message}`,
                        statusCode.unprocessableEntity()
                    )
                );
            }
            return response.data.data.authorization_url;
        }
        return next(
            new AppError(
                'please login to gain access',
                statusCode.unauthorized()
            )
        );
    }

    private verify(eventData: any, signature: string): boolean {
        const hmac = crypto.createHmac('sha512', `${this.PAYSTACK_SECERT_KEY}`);
        const expectedSignature = hmac
            .update(JSON.stringify(eventData))
            .digest('hex');
        return expectedSignature === signature;
    }

    public async paystackWebhook(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<any> {
        const eventData = req.body;
        const signature = req.headers[
            'x-paystack-signature'
        ] as unknown as string;

        if (!this.verify(eventData, signature)) {
            return next(
                new AppError(
                    'unable to verify transaction',
                    statusCode.badRequest()
                )
            );
        }
        if (eventData.event === 'charge.success') {
            const { userId, walletId, transactionType, transactionStatus } =
                eventData.data.metadata;
            // Acknowledge receiving the webhook
            res.sendStatus(200);
            // Process the successful transaction to update wallet Model
            const payload: any = {
                transactionId: eventData.data.id,
                transactionReference: eventData.data.reference,
                amount: (eventData.data.amount / 100) as number,
                currency: eventData.data.currency,
                transactionFee: (eventData.data.fees / 100) as number,
                status: eventData.data.status,
                transactionMethod: eventData.data.channel,
                description: eventData.data.message || eventData.data.reason,
                transactionType,
                transactionStatus,
                walletId,
                paidAt: eventData.data.paid_at
            };

            await walletService.fundWallet(payload, userId, next);
        }
    }
}

export const paystack = new PaystackService();
