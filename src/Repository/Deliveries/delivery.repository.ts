import { IDeliveryItem } from '../../Models/Deliveries/delivery.model';
import TABLE from '../../Models/index';

export default class DeliveryItemRepository {
    async addDeliveryItem(payload: IDeliveryItem): Promise<IDeliveryItem> {
        const delivery: any = await TABLE.ITEMS.query().insert(payload);
        return delivery as IDeliveryItem;
    }

    async findDeliveryItemById(itemId: string): Promise<IDeliveryItem | null> {
        const delivery: any = await TABLE.ITEMS.query()
            .where('itemId', itemId)
            .withGraphFetched('users');
        if (delivery.length > 0) {
            return delivery[0];
        }
        return null;
    }

    async findDeliveryItems(): Promise<IDeliveryItem[]> {
        const deliveries = await TABLE.ITEMS.query()
            .select('*')
            .withGraphFetched('users');
        return deliveries as any;
    }

    async findUserDeliveryItems(
        userId: string
    ): Promise<IDeliveryItem[] | null> {
        const deliveries: any = await TABLE.ITEMS.query()
            .where('userId', userId)
            .withGraphFetched('users');
        if (deliveries.length > 0) {
            return deliveries;
        }
        return null;
    }

    async updateDeliveryItem(
        payload: IDeliveryItem,
        itemId: string
    ): Promise<null | IDeliveryItem> {
        const item: any = await TABLE.ITEMS.query()
            .where('itemId', '=', itemId)
            .update(payload)
            .returning('*');
        return item[0] as IDeliveryItem;
    }
}
