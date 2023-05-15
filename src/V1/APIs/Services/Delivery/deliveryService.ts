import { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import { Delivery, DeliveryType } from '../../Models/delivery.model';
import DeliveryRepository from '../../Repository/Delivery/deliveryRepository';
import { response } from '../../Utilities/response';

const deliveryRepository = new DeliveryRepository();

dotenv.config({ path: './src/V1/APIs/Config/.env' });

export default class DeliveryService {
    // Here is the logics for logged in user to creating new order
    public async createDelivery(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            const {
                item,
                destination,
                sender_name,
                sender_number,
                reciever_name,
                reciever_number,
            } = req.body;

            const delivery = await deliveryRepository.createDelivery({
                userId: req.user.id,
                item: item,
                destination: destination,
                sender_name: sender_name,
                sender_number: sender_number,
                reciever_name: reciever_name,
                reciever_number: reciever_number,
            });

            if (!delivery) {
                return res.status(500).json(
                    response({
                        success: false,
                        message: 'Failed to create delivery',
                    })
                );
            }
            return res.status(201).json({
                success: true,
                message: 'Delivery created succesfully!',
                delivery,
            });
        } catch (error) {
            console.log((error as Error).message);
            return res.status(500).json({
                success: false,
                message: (error as Error).message,
            });
        }
    }
    // Here is the logic for fetching all orders from database
    public async getAllDeliveries(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            //Get authenticated User
            const userId = String(req.user.id);

            //Return all Users orders
            const deliveries: DeliveryType[] =
                await deliveryRepository.getAllDelivery(userId);

            //Return status 404 if not found
            if (!deliveries || !deliveries.length)
                return res.status(404).json(
                    response({
                        message: `Delivery not found for user ${String(
                            req.user.first_name
                        )}`,
                    })
                );

            //Return status 200 for all Users orders
            return res
                .status(200)
                .json(response({ message: 'Orders found', data: deliveries }));
        } catch (error) {
            return res.status(400).json({
                success: false,
                message: 'Oops! Something went wrong!, please try again',
            });
        }
    }
    // Here is the logic to get order by id
    public async getDeliveryById(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            const { orderId } = req.params;
            const userId = String(req.user.id);
            //Find Order by User Id and Order ID
            const delivery: DeliveryType[] =
                await deliveryRepository.getDeliveryById(orderId, userId);

            //Return status 404 if not found
            if (!delivery || !delivery.length)
                return res.status(404).json(
                    response({
                        message: `delivery not found for user ${String(
                            req.user.first_name
                        )}`,
                    })
                );

            //Return status 200 if found
            return res
                .status(200)
                .json(response({ message: 'delivery found', data: delivery }));
        } catch (error) {
            return res.status(400).json({
                success: false,
                message: `Sorry! delivery id ${req.params.id} does not exist`,
            });
        }
    }
}
