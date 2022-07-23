import { combineReducers } from "redux";
import chat from "./chat/reducer";
import tickets from "./tickets/reducer";
import auth from "./auth/reducer";

const rootReducer = combineReducers({
    auth,
    chat,
    tickets
});

export default rootReducer;
