import {
    signUp,
    activateUserAccount,
    forgotPassword,
    login,
    refreshToken,
    resendOTP,
    resetPassword
} from './Auth/auth.controllers';
import {
    findUser,
    findUsers,
    changeUserEmail,
    changeUserPassword,
    updateMe
} from './Users/user.controllers';

export default {
    signUp,
    activateUserAccount,
    forgotPassword,
    login,
    refreshToken,
    resendOTP,
    resetPassword,
    findUser,
    findUsers,
    changeUserEmail,
    changeUserPassword,
    updateMe
};
