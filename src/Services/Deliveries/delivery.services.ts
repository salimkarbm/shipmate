import { Request, NextFunction } from 'express';
import { IDeliveryItem } from '../../Models/Deliveries/delivery.model';
import { IUser } from '../../Models/Users/user.model';
import { deliveryItemRepository, userRepository } from '../../Repository/index';
import AppError from '../../Utils/Errors/appError';
import Utilities, { statusCode, getFilePath } from '../../Utils/helpers';

const util = new Utilities();

export default class DeliveryItemService {
    public async findDeliveryItems(
        req: Request,
        next: NextFunction
    ): Promise<IDeliveryItem[] | void> {
        const items = await deliveryItemRepository.findDeliveryItems();
        return items as IDeliveryItem[];
    }

    public async findDeliveryItem(
        req: Request,
        next: NextFunction
    ): Promise<IDeliveryItem | void> {
        const { itemId } = req.params;
        const item: any =
            await deliveryItemRepository.findDeliveryItemById(itemId);

        if (typeof item === 'object' && item !== null) {
            item.users.OTP = 'undefined';
            item.users.otpExpiresAt = undefined;
            return item as IDeliveryItem;
        }
        return next(new AppError('Trip not found', statusCode.notFound()));
    }

    public async addDeliveryItem(
        req: Request,
        next: NextFunction
    ): Promise<IDeliveryItem | void> {
        const { userId } = req.user;
        if (userId) {
            const user: IUser | null =
                await userRepository.findUserById(userId);
            if (!user) {
                return next(
                    new AppError('user not found', statusCode.notFound())
                );
            }
            const itemImagePath = getFilePath(req);
            if (!itemImagePath) {
                return next(
                    new AppError(
                        'please upload item image',
                        statusCode.notFound()
                    )
                );
            }
            const cloudinary = await util.cloudinaryUpload(itemImagePath);
            if (!cloudinary) {
                return next(
                    new AppError(
                        'Cloudinary not found! unable to upload image',
                        statusCode.notFound()
                    )
                );
            }
            const newDeliveryItem: any =
                await deliveryItemRepository.addDeliveryItem({
                    ...req.body,
                    userId,
                    ItemImage: cloudinary.secure_url,
                    ItemImageId: cloudinary.public_id
                });
            return newDeliveryItem;
        }
        throw next(new AppError('Not authorized', statusCode.unauthorized()));
    }

    public async findUserDeliveryItems(
        req: Request,
        next: NextFunction
    ): Promise<IDeliveryItem[] | void> {
        const { userId } = req.user;
        if (userId === req.params.userId) {
            const user: IUser | null =
                await userRepository.findUserById(userId);
            if (!user) {
                return next(
                    new AppError('user not found', statusCode.notFound())
                );
            }
            const items = await deliveryItemRepository.findUserDeliveryItems(
                user.userId as unknown as string
            );
            return items as IDeliveryItem[];
        }
        throw next(new AppError('Not authorized', statusCode.unauthorized()));
    }
}
