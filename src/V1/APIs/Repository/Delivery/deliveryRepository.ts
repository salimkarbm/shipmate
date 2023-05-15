import { Delivery, DeliveryType } from '../../Models/delivery.model';

export default class DeliveryRepository {
    getAllDeliveries: any;
    async createDelivery(delivery: DeliveryType): Promise<DeliveryType> {
        const {
            userId,
            item,
            destination,
            sender_name,
            sender_number,
            reciever_name,
            reciever_number,
        } = delivery;
        const newDelivery: any = await Delivery.query().insert({
            userId,
            item,
            destination,
            sender_name,
            sender_number,
            reciever_name,
            reciever_number,
        });
        return newDelivery as DeliveryType;
    }
    async getAllDelivery(userId: string | number): Promise<DeliveryType[]> {
        const delivery: DeliveryType[] = (await Delivery.query()
            .where('userId', userId)
            .then((rows) => rows)) as DeliveryType[];

        return delivery;
    }
    async getDeliveryById(
        orderId: string | number,
        userId: string | number
    ): Promise<DeliveryType[]> {
        const delivery: DeliveryType[] = (await Delivery.query()
            .where('id', orderId)
            .andWhere('userId', userId)
            .then((rows) => rows)) as DeliveryType[];
        return delivery;
    }
}
