import { SET_AUTH_USER, SET_USER_IN_ACTIVE } from "./types";

const initialState = {
    user: {},
    isUserInActive: false,
};

const AuthReducer = (state = initialState, { type, payload }) => {
    switch (type) {
        case SET_AUTH_USER:
            return { ...state, user: payload };

        case SET_USER_IN_ACTIVE:
            return { ...state, isUserInActive: payload };

        default:
            return state;
    }
};

export default AuthReducer;
