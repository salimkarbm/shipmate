import bcrypt from 'bcrypt';
import 'dotenv/config';
import { convert } from 'html-to-text';
import { v4 as uuidv4 } from 'uuid';
import jwt, { JwtPayload } from 'jsonwebtoken';
import UserRepository from '../Repository/Users/user.repository';
import logger from './Logger/index';

const userRepository = new UserRepository();

export class Utilities {
    private pepper = String(process.env.BCRYPT_PASSWORD);

    private saltRound = Number(process.env.SALT_ROUNDS);

    private accessToken = process.env.ACCESSTOKENSECRET as string;

    public async verifyJWT(token: string) {
        try {
            return {
                payload: jwt.verify(token, this.accessToken),
                expired: false
            };
        } catch (error) {
            logger.error(error);
            if ((error as Error).name === 'TokenExpiredError') {
                return { payload: jwt.decode(token), expired: true };
            }
            throw error;
        }
    }

    public async generateHash(plainPassword: string): Promise<string> {
        const hash = await bcrypt.hash(
            plainPassword + this.pepper,
            this.saltRound
        );
        return hash;
    }

    public generateUUID(): string {
        const uuid = uuidv4();
        return uuid;
    }

    generateRandomCode = (size = 8, alpha = true): number | string => {
        const characters = alpha
            ? '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ-'
            : '0123456789';
        const chars = characters.split('');
        let selections = '';
        for (let i = 0; i < size; i += 1) {
            const index = Math.floor(Math.random() * chars.length);
            selections += chars[index];
            chars.splice(index, 1);
        }
        return selections;
    };

    async generateOtpCode() {
        const OTP = this.generateRandomCode(6, false) as number;
        return {
            OTP,
            otpExpiresAt: Date.now() + 10 * 60 * 1000
        };
    }

    async convertEmailToText(html: string) {
        const result = convert(html, {
            wordwrap: 150
        });
        return result;
    }

    async comparePassword(
        password: string,
        hashPassword: string
    ): Promise<boolean> {
        const result = await bcrypt.compare(
            password + this.pepper,
            hashPassword
        );
        return result;
    }

    async generateToken(email: string) {
        const accessTokenSecret = process.env.ACCESSTOKENSECRET as string;
        const refreshTokenSecret = process.env.REFRESHTOKENSECRET as string;
        const payload: any = await userRepository.findUserByEmail(email);
        const data = {
            userId: payload.userId,
            role: payload.role,
            email: payload.email,
            occupation: payload.occupation
        };
        const accessToken = jwt.sign(data, accessTokenSecret, {
            expiresIn: '1800s'
        });
        const refreshToken = jwt.sign(data, refreshTokenSecret, {
            expiresIn: '1d'
        });
        return Promise.resolve({ accessToken, refreshToken });
    }

    // verify refresh token
    async verifyToken(email: string, token: string) {
        try {
            const decoded: JwtPayload = jwt.decode(token) as JwtPayload;
            const expirationTime = decoded.exp as number;
            const currentTime = Math.floor(Date.now() / 1000);
            if (currentTime > expirationTime || decoded.email !== email) {
                // token has expired
                return false;
            }
            // token is still valid
            return true;
        } catch (error) {
            logger.error(error);
            return false;
        }
    }

    async decodeJwtToken(token: string) {
        const decoded = jwt.decode(token) as JwtPayload;
        return decoded;
    }

    Date() {
        const currentdate = new Date();
        const datetime = `Last Sync: ${currentdate.getDate()}/${
            currentdate.getMonth() + 1
        }/${currentdate.getFullYear()} @ ${currentdate.getHours()}:${currentdate.getMinutes()}:${currentdate.getSeconds()}`;
        return datetime;
    }
}

export const util = new Utilities();
