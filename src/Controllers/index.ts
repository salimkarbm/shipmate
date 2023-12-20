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
    updateMe,
    addCar,
    viewUserProfile
} from './Users/user.controllers';

import {
    findTrip,
    findTrips,
    addTrip,
    findUserTrips
} from './Trips/trip.controllers';

import {
    findDeliveryItem,
    findDeliveryItems,
    addDeliveryItem,
    findUserDeliveryItems
} from './Deliveries/delivery.controllers';

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
    updateMe,
    addCar,
    viewUserProfile,
    findTrip,
    findTrips,
    addTrip,
    findUserTrips,
    findDeliveryItem,
    findDeliveryItems,
    addDeliveryItem,
    findUserDeliveryItems
};
