import { SET_AUTH_USER } from "./types";

const initialState = {
	user: {},
};

const AuthReducer = (state = initialState, { type, payload }) => {
	switch (type) {
		case SET_AUTH_USER:
			return { ...state, user: payload };

		default:
			return state;
	}
};

export default AuthReducer;
