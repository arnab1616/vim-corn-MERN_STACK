import { configureStore } from "@reduxjs/toolkit";
import userReducer from './userSlice.js';
import subscribeReducer from './suscribeSlice.js'
import { persistStore } from "redux-persist";

export const store = configureStore({
    reducer: {
        users: userReducer,
        subscribe : subscribeReducer
    }
})
export const persistor = persistStore(store);