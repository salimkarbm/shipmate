import { Router } from 'express';

import validate from '../../Middlewares/reqValidation.middleware';
import authenticate from '../../Middlewares/tokenVerification.middleware';
import {
    userIdValidationRules,
    userEmailValidationRules,
    userProfileUpdateValidationRules,
    carValidationRules
} from '../../Middlewares/Users/user.middlewares';
import user from '../../Controllers/index';
import Media from '../../Utils/media/media';

const image = new Media();

const router = Router();

router.route('/').get(validate, user.findUsers);

router
    .route('/changeEmail')
    .patch(
        userEmailValidationRules,
        validate,
        authenticate,
        user.changeUserEmail
    );
router
    .route('/changePassword')
    .patch(validate, authenticate, user.changeUserPassword);

router
    .route('/addCar')
    .post(
        image.upload.single('carPhoto'),
        carValidationRules(),
        validate,
        authenticate,
        user.addCar
    );

router.route('/viewProfile').get(authenticate, validate, user.viewUserProfile);

router
    .route('/updateMe')
    .patch(
        image.upload.single('profilePicture'),
        userProfileUpdateValidationRules(),
        validate,
        authenticate,
        user.updateMe
    );
router
    .route('/:userId')
    .get(userIdValidationRules(), validate, authenticate, user.findUser);

export default router;
