import bcrypt from 'bcrypt';
import 'dotenv/config';
import { v2 as cloudinary } from 'cloudinary';
import { convert } from 'html-to-text';
import path from 'path';
import fs from 'fs';
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import jwt, { JwtPayload } from 'jsonwebtoken';
import UserRepository from '../Repository/Users/user.repository';

const userRepository = new UserRepository();

export default class Utilities {
    private pepper = String(process.env.BCRYPT_PASSWORD);

    private saltRound = Number(process.env.SALT_ROUNDS);

    private accessToken = process.env.ACCESSTOKENSECRET as string;

    public async cloudinaryUpload(url: string) {
        if (url) {
            cloudinary.config({
                cloud_name: process.env.CLOUDINARY_NAME,
                api_key: process.env.CLOUDINARY_API_KEY,
                api_secret: process.env.CLOUDINARY_API_SECRET
            });
            const upload = await cloudinary.uploader.upload(url, {
                folder: 'Shipmate'
            });
            return upload;
        }
    }

    public async cloudinaryDestroy(publicId: string) {
        cloudinary.config({
            cloud_name: process.env.CLOUDINARY_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_API_SECRET
        });
        const upload = await cloudinary.uploader.destroy(publicId);
        return upload;
    }

    public async verifyJWT(token: string) {
        try {
            return {
                payload: jwt.verify(token, this.accessToken),
                expired: false
            };
        } catch (error) {
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
            id: payload.user_id,
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

export const statusCode = {
    ok() {
        return 200;
    },

    created() {
        return 201;
    },

    accepted() {
        return 202;
    },

    noContent() {
        return 204;
    },

    resetContent() {
        return 205;
    },

    partialContent() {
        return 206;
    },

    badRequest() {
        return 400;
    },

    unauthorized() {
        return 401;
    },

    paymentRequired() {
        return 402;
    },

    accessForbidden() {
        return 403;
    },

    notFound() {
        return 404;
    },

    methodNotAllowed() {
        return 405;
    },

    notAccepted() {
        return 406;
    },

    proxyAuthenticationRequired() {
        return 407;
    },

    requestTimeout() {
        return 408;
    },

    conflict() {
        return 409;
    },

    unprocessableEntity() {
        return 422;
    },

    internalServerError() {
        return 500;
    },

    notImplemented() {
        return 501;
    },

    badGateway() {
        return 502;
    },

    serviceUnavalaibleError() {
        return 503;
    },

    gatewayTimeout() {
        return 504;
    }
};

// Get single file path
export const getFilePath = (req: any) => {
    const filePath = req.file;
    if (filePath) {
        const file = String(filePath.path);
        return file;
    }
};
// Get multiple file path
export const getMultipleFilePath = (req: any): any => {
    const { files } = req;
    const file1 = String(files[0] && files[0].path);
    const file2 = String(files[0] && files[1].path);
    return {
        file1,
        file2
    };
};
// create folder to store images/files
export const fileStorageEngine = multer.diskStorage({
    destination: (req: any, file: any, cb: any) => {
        const dir = `${path.normalize(path.join(__dirname, '../images'))}`;
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
        }
        cb(null, dir);
    },

    filename: (req: any, file: any, cb: any) => {
        cb(null, `${Date.now()}--${path.extname(file.originalname)}`);
    }
});

// check file/images
export const fileFilter = (req: any, file: any, cb: any) => {
    if (
        file.mimetype === 'image/jpeg' ||
        file.mimetype === 'image/png' ||
        file.mimetype === 'image/jpg'
    ) {
        cb(null, true);
    } else if (file.mimetype === 'application/pdf') {
        cb(null, true);
    } else {
        cb({ message: `Unsupported file format ${file.mimetype}` });
    }
};

export const upload = multer({
    storage: fileStorageEngine,
    limits: { fileSize: 4200 * 3800 },
    fileFilter
});

// upload  multiple files at once
export const multipleUpload = upload.fields([
    { name: 'file1', maxCount: 1 },
    { name: 'file2', maxCount: 1 },
    { name: 'file3', maxCount: 1 },
    { name: 'file4', maxCount: 1 },
    { name: 'file5', maxCount: 1 }
]);
