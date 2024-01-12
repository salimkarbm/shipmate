import { Request, NextFunction } from 'express';
import { IUser, IProfile } from '../../Models/Users/user.model';
import { userRepository } from '../../Repository/index';
import AppError from '../../Utils/Errors/appError';
import Utilities from '../../Utils/helpers';
import Media from '../../Utils/media/media';
import HttpStatusCode from '../../Utils/HttpStatusCode/httpStatusCode';

const statusCode = new HttpStatusCode();

const image = new Media();

const util = new Utilities();

export default class UserService {
    public async findUsers(
        req: Request,
        next: NextFunction
    ): Promise<IUser[] | void> {
        const users = await userRepository.findUsers();
        return users as IUser[];
    }

    public async findUser(
        req: Request,
        next: NextFunction
    ): Promise<IUser | void> {
        const { userId } = req.params;
        const user = await userRepository.findUserById(userId);
        if (typeof user === 'object' && user !== null) {
            return user as IUser;
        }
        return next(new AppError('User not found', statusCode.notFound()));
    }

    public async changeUserEmail(
        req: Request,
        next: NextFunction
    ): Promise<IUser | void> {
        const { userId } = req.user;
        if (userId) {
            const student: any = await userRepository.findUserById(userId);
            if (Object.keys(student).length !== 0) {
                // update user data
                const user: any = await userRepository.updateUserEmail(
                    { ...req.body },
                    student.userId
                );
                return user;
            }
            return next(
                new AppError(
                    'User with this ID not found',
                    statusCode.notFound()
                )
            );
        }
        return next(
            new AppError('Please login to gain access', statusCode.badRequest())
        );
    }

    public async changeUserPassword(
        req: Request,
        next: NextFunction
    ): Promise<IUser | void> {
        const { userId } = req.user;
        const { oldPassword, newPassword, confirmNewPassword } = req.body;
        if (userId) {
            // check if password matches
            if (newPassword !== confirmNewPassword) {
                return next(
                    new AppError(
                        'The password and confirm password fields must match.',
                        statusCode.badRequest()
                    )
                );
            }
            const student: any = await userRepository.findUserById(userId);
            if (Object.keys(student).length !== 0) {
                // compare hash password against user data
                const comparePassword = await util.comparePassword(
                    oldPassword,
                    student.passwordDigest
                );
                if (comparePassword) {
                    // hash password
                    const hashPassword = await util.generateHash(newPassword);
                    // update students data
                    const { passwordDigest } = { passwordDigest: hashPassword };
                    const user: any = await userRepository.updateUserPassword(
                        passwordDigest,
                        student.userId
                    );
                    return user;
                }
                return next(
                    new AppError('Invalid Password', statusCode.badRequest())
                );
            }
            return next(
                new AppError(
                    'User with this ID not found',
                    statusCode.notFound()
                )
            );
        }
        throw next(new AppError('Not authorized', statusCode.unauthorized()));
    }

    public async updateMe(
        req: Request,
        next: NextFunction
    ): Promise<IUser | void> {
        const { userId } = req.user;
        if (userId) {
            const user: IUser | null =
                await userRepository.findUserById(userId);
            if (!user) {
                return next(
                    new AppError('user not found', statusCode.notFound())
                );
            }
            const profilePicturePath = image.getFilePath(req);
            let cloudinary: any;
            if (profilePicturePath) {
                if (user?.profilePictureId) {
                    // Delete the existing profile Picture using the correct profile Picture Id
                    await image.cloudinaryDestroy(
                        user?.profilePictureId as string
                    );
                }
                cloudinary = await image.cloudinaryUpload(profilePicturePath);
                if (!cloudinary) {
                    return next(
                        new AppError(
                            'Cloudinary not found! unable to upload image',
                            statusCode.notFound()
                        )
                    );
                }
            }
            const payload: any = {
                firstName: req.body.firstName || user?.firstName,
                lastName: req.body.lastName || user?.lastName,
                otherName: req.body.otherName || user?.otherName,
                bio: req.body.bio || user?.bio,
                address: req.body.address || user?.address,
                userType: req.body.userType || user?.userType,
                gender: req.body.gender || user?.gender,
                NIN: req.body.NIN || user?.NIN,
                phoneNumber: req.body.phoneNumber || user?.phoneNumber,
                profilePicture: cloudinary?.secure_url || user?.profilePicture,
                profilePictureId:
                    cloudinary?.public_id || user?.profilePictureId
            };

            const updatedUser: any = await userRepository.updateUser(
                payload,
                userId
            );
            if (updatedUser.userType.toLowerCase() === 'traveller') {
                const updatedUserProfile: any =
                    await userRepository.updateIsProfileCompleteToTrue(userId);
                return updatedUserProfile;
            }
            return updatedUser;
        }
        throw next(new AppError('Not authorized', statusCode.unauthorized()));
    }

    public async addCar(
        req: Request,
        next: NextFunction
    ): Promise<IUser | void> {
        const { userId } = req.user;
        if (userId) {
            const user: IUser | null =
                await userRepository.findUserById(userId);
            if (!user) {
                return next(
                    new AppError('user not found', statusCode.notFound())
                );
            }
            const carPhotoPath = image.getFilePath(req);
            let cloudinary: any;
            if (carPhotoPath) {
                cloudinary = await image.cloudinaryUpload(carPhotoPath);
                if (!cloudinary) {
                    return next(
                        new AppError(
                            'Cloudinary not found! unable to upload image',
                            statusCode.notFound()
                        )
                    );
                }
            }
            const newCar: any = await userRepository.addCar({
                ...req.body,
                userId,
                carPhoto: cloudinary.secure_url,
                carPhotoId: cloudinary.public_id
            });
            const { userType } = user;
            if (userType?.toLowerCase() === 'Rider') {
                const updatedUserProfile: any =
                    await userRepository.updateIsProfileCompleteToTrue(userId);
                return updatedUserProfile;
            }
            return newCar;
        }
        throw next(new AppError('Not authorized', statusCode.unauthorized()));
    }

    public async viewProfile(
        req: Request,
        next: NextFunction
    ): Promise<IProfile | void> {
        const { userId } = req.user;
        if (userId) {
            const users: IProfile | null =
                await userRepository.viewProfile(userId);
            return users as IProfile;
        }
        throw next(new AppError('Not authorized', statusCode.unauthorized()));
    }
}
