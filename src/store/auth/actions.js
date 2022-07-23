import { SET_AUTH_USER } from "./types";

export const pushAuthUser = (userData) => dispatch => dispatch({ type: SET_AUTH_USER, payload: userData })
