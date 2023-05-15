import express, { Request, Response, NextFunction } from 'express';
import DeliveryService from '../../Services/Delivery/deliveryService';

const deliveryService = new DeliveryService();

export default class orderController {
    public async createDelivery(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        return deliveryService.createDelivery(req, res, next);
    }

    public async getAllDelivery(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        return deliveryService.getAllDeliveries(req, res, next);
    }

    public async getDeliveryById(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        return deliveryService.getDeliveryById(req, res, next);
    }
}
