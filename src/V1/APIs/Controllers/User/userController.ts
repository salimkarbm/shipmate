import express, { Request, Response, NextFunction } from 'express';
import UserService from '../../Services/User/userService';

const userService = new UserService();

export default class userController {
    public async getRiders(req: Request, res: Response, next: NextFunction) {
        return userService.getAllRiders(req, res, next);
    }
}
