import { createStore, applyMiddleware } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import { persistStore, persistReducer } from "redux-persist";
import storage from 'redux-persist/lib/storage/session'

import thunk from "redux-thunk";
import rootReducer from "./rootReducer";

const persistConfig = {
    key: "root",
    storage,
    // whitelist: ["auth"]
};
export const middleware = [thunk];
const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = createStore(
    persistedReducer,
    composeWithDevTools(applyMiddleware(...middleware))
);

export const persistor = persistStore(store);
export default store;