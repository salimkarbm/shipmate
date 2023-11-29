import { Request, NextFunction } from 'express';
import { IUser } from '../../Models/Users/user.models';
import { userRepository } from '../../Repository/index';
import AppError from '../../Utils/Errors/appError';
import Utilities, { statusCode, getFilePath } from '../../Utils/helpers';

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
        if (user) {
            return user as IUser;
        }
        throw next(new AppError('User not found', statusCode.notFound()));
    }

    public async changeUserEmail(
        req: Request,
        next: NextFunction
    ): Promise<IUser | void> {
        const { userId } = req.user;
        if (userId) {
            const student: any = await userRepository.findUserById(userId);
            if (Object.keys(student).length !== 0) {
                // update students data
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
            const profilePicturePath = getFilePath(req);
            let cloudinary: any;
            if (profilePicturePath) {
                if (user?.profilePictureId) {
                    // Delete the existing profile Picture using the correct profile Picture Id
                    await util.cloudinaryDestroy(
                        user?.profilePictureId as string
                    );
                }
                cloudinary = await util.cloudinaryUpload(profilePicturePath);
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
                firstName: user?.firstName || req.body.firstName,
                lastName: user?.lastName || req.body.lastName,
                otherName: user?.otherName || req.body.otherName,
                bio: user?.bio || req.body.bio,
                address: user?.address || req.body.address,
                userType: user?.userType || req.body.userType,
                gender: user?.gender || req.body.gender,
                NIN: user?.NIN || req.body.NIN,
                phoneNumber: user?.phoneNumber || req.body.phoneNumber,
                profilePicture: user?.profilePicture || cloudinary?.secure_url,
                profilePictureId:
                    user?.profilePictureId || cloudinary?.public_id
            };

            const updatedUser: any = await userRepository.updateUser(
                payload,
                userId
            );
            return updatedUser;
        }
        throw next(new AppError('Not authorized', statusCode.unauthorized()));
    }
}
