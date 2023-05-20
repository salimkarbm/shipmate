import 'dotenv/config';
import bcrypt from 'bcrypt';
import jwt, { JwtPayload } from 'jsonwebtoken';
import UserRepository from '../Repository/User/userRepository';


const userRepository = new UserRepository();

export class utils {
    private pepper = String(process.env.BCRYPT_PASSWORD);
    private saltRound = Number(process.env.SALT_ROUNDS);
    private secret = String(process.env.SECRET);

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
            if (expirationTime < currentTime  && decoded.email !== email) {
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
