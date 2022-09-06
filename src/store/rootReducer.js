import { combineReducers } from "redux";
import chat from "./chat/reducer";
import tickets from "./tickets/reducer";
import auth from "./auth/reducer";import storage from "redux-persist/lib/storage";
;

export const SIGNOUT_REQUEST = 'SIGNOUT_REQUEST';

const appReducer = combineReducers({
    auth,
    chat,
    tickets
});

const rootReducer = (state, action) => {
    if (action.type === SIGNOUT_REQUEST) {
        // for all keys defined in your persistConfig(s)
        sessionStorage.removeItem('persist:root');
        storage.removeItem('persist:root');
        // storage.removeItem('persist:otherKey')
        state = undefined;
        // return appReducer(undefined, {});
    }
    return appReducer(state, action);
};

export default rootReducer;
