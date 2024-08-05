import { configureStore } from "@reduxjs/toolkit";
import { useSelector } from "react-redux";
import { authSlice, matchSlice, playerSlice } from "./feature";

const store = configureStore({
    reducer: {
        auth: authSlice,
        player: playerSlice,
        match: matchSlice
    }
});



export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>
export const useAppSelector = useSelector.withTypes<RootState>()
export default store;