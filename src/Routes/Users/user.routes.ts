import { Router } from 'express';

import validate from '../../Middlewares/reqValidation.middleware';
import authenticate from '../../Middlewares/tokenVerification.middleware';
import { userIdValidationRules } from '../../Middlewares/Users/user.middlewares';
import { findUser, findUsers } from '../../Controllers/Users/user.controllers';

const router = Router();

router.route('/').get(validate, authenticate, findUsers);
router.route('/:userId').get(userIdValidationRules(), validate, findUser);

export default router;