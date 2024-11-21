import { configureStore } from "@reduxjs/toolkit";
import { useSelector } from "react-redux";
import { authSlice, matchSlice, playerSlice } from "./feature";
import tournamentSlice from "./feature/tournamentSlice";
import tournamentPlayerSlice from "./feature/tournamentPlayerSlice";
import notificationSlice from "./feature/notificationSlice";

const store = configureStore({
    reducer: {
        auth: authSlice,
        player: playerSlice,
        match: matchSlice,
        tournament: tournamentSlice,
        tournamentPlayer: tournamentPlayerSlice,
        Notification: notificationSlice
    }
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>
export const useAppSelector = useSelector.withTypes<RootState>()
export default store;