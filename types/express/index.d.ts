import { UserType } from '../../src/V1/APIs/Models/user.model';

declare global {
    declare namespace Express {
        interface Request {
            user: UserType;
        }
    }
}
