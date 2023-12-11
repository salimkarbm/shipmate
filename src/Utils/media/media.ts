import 'dotenv/config';
import { v2 as cloudinary } from 'cloudinary';
import path from 'path';
import fs from 'fs';
import multer from 'multer';

export default class Media {
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

    // Get single file path
    getFilePath = (req: any) => {
        const filePath = req.file;
        if (filePath) {
            const file = String(filePath.path);
            return file;
        }
    };

    // Get multiple file path
    getMultipleFilePath = (req: any): any => {
        const { files } = req;
        const file1 = String(files[0] && files[0].path);
        const file2 = String(files[0] && files[1].path);
        return {
            file1,
            file2
        };
    };

    // create folder to store images/files
    fileStorageEngine = multer.diskStorage({
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
    fileFilter = (req: any, file: any, cb: any) => {
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

    upload = multer({
        storage: this.fileStorageEngine,
        limits: { fileSize: 4200 * 3800 },
        fileFilter: this.fileFilter
    });

    // upload  multiple files at once
    multipleUpload = this.upload.fields([
        { name: 'file1', maxCount: 1 },
        { name: 'file2', maxCount: 1 },
        { name: 'file3', maxCount: 1 },
        { name: 'file4', maxCount: 1 },
        { name: 'file5', maxCount: 1 }
    ]);
}
