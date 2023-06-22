import { SET_AUTH_USER, SET_USER_IN_ACTIVE } from "./types";

export const pushAuthUser = (userData) => (dispatch) =>
    dispatch({ type: SET_AUTH_USER, payload: userData });

export const setUserInActive = (isActive) => (dispatch) =>
    dispatch({ type: SET_USER_IN_ACTIVE, payload: isActive });
