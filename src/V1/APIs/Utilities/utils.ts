import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import jwt, { JwtPayload } from 'jsonwebtoken';
import UserRepository from '../Repository/User/userRepository';
import { OAuth2Client } from 'google-auth-library';
import { Request, NextFunction } from 'express';
import axios from 'axios';
import { AppError } from '../Utilities/Errors/appError';

dotenv.config({ path: './src/V1/APIs/Config/.env' });

const userRepository = new UserRepository();

export class utils {
    private pepper = process.env.BCRYPT_PASSWORD as string;
    private saltRound = Number(process.env.SALT_ROUNDS);
    private GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID as string;
    private GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET as string;
    private SERVER_ROOT_URI = process.env.SERVER_ROOT_URI as string;
    private rootUrl = 'https://accounts.google.com/o/oauth2/v2/auth';
    private secret = process.env.SECRET as string;

    public getGoogleAuthURL = (req: Request) => {
        const options = {
            redirect_uri: `${this.SERVER_ROOT_URI}`,
            client_id: `${this.GOOGLE_CLIENT_ID}`,
            access_type: 'offline',
            response_type: 'code',
            prompt: 'consent',
            scope: [
                'https://www.googleapis.com/auth/userinfo.profile',
                'https://www.googleapis.com/auth/userinfo.email',
            ].join(' '),
        };
        const querystring = new URLSearchParams(options);
        return `${this.rootUrl}?${querystring}`;
    };

    public getTokens = async (req: Request, next: NextFunction) => {
        try {
            /*
             * Uses the code to get tokens
             * that can be used to fetch the user's profile
             */

            const code = req.query.code as string;
            const client = new OAuth2Client(
                this.GOOGLE_CLIENT_ID,
                this.GOOGLE_CLIENT_SECRET,
                this.SERVER_ROOT_URI
            );
            const { res } = await client.getToken(code);

            const data = {
                id_token: res?.data.id_token as string,
                access_token: res?.data.access_token as string,
            };
            const googleUser = await axios.get(
                `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${data.access_token}`,
                {
                    headers: {
                        Authorization: `Bearer ${data.id_token}`,
                    },
                }
            );

            return googleUser.data;
        } catch (error) {
            throw next(new AppError(`something went wrong! ${error}`, 500));
        }
    };

    public bcrypt = async (str: string): Promise<string> => {
        return await bcrypt.hash(str + this.pepper, this.saltRound);
    };
    async generateAccessToken(email: string) {
        const accessTokenSecret = process.env.ACCESSTOKENSECRET as string;
        const refreshTokenSecret = process.env.REFRESHTOKENSECRET as string;
        const payload: any = await userRepository.findUserByEmail(email);

        const data = {
            user_id: payload.id,
            userType: payload.user_type,
            email: payload.email,
            name: payload.first_name + ' ' + payload.last_name,
        };
        const accessToken = jwt.sign(data, accessTokenSecret, {
            expiresIn: '1800s',
        });
        const refreshToken = jwt.sign(data, refreshTokenSecret, {
            expiresIn: '1d',
        });
        return Promise.resolve({ accessToken, refreshToken });
    }
    async verifyRefreshToken(email: string, refreshToken: string) {
        try {
            const decoded: JwtPayload = jwt.decode(refreshToken) as JwtPayload;
            const expirationTime = decoded.exp as number;
            const currentTime = new Date().getTime() / 1000;
            if (expirationTime < currentTime && decoded.email !== email) {
                // token has expired
                return false;
            } else {
                // token is still valid
                return true;
            }
        } catch (error) {
            return false;
        }
    }
    public compare = async (
        compare: string,
        against: string
    ): Promise<boolean> => {
        return await bcrypt.compare(compare + this.pepper, against);
    };
}
export default new utils();
