import { IUser } from '../../src/Models/Users/user.models';

declare global {
    declare namespace Express {
        interface Request {
            user: IUser;
        }
    }
}
