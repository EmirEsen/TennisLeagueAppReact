import { BrowserRouter, Navigate, Route, Routes, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { logout, setToken } from "../store/feature/authSlice";
import { AppDispatch, useAppSelector } from "../store";
import { fetchPlayerProfile } from "../store/feature/playerSlice";

import Login from "./auth/Login";
import Register from "./auth/Register";
import Profile from "./Profile";
import Home from "./Home";
import VerifyEmail from "./auth/VerifyEmail";
import PlayerView from "./PlayerView";
import TournamentPage from "./TournamentPage";
import MyTournaments from "./MyTournaments";
import NavBar from "../components/organisms/NavBar";
import AuthGuard from "./auth/AuthGuard";
import { CircularProgress } from "@mui/material";

function AppContent() {
    const dispatch = useDispatch<AppDispatch>();
    const location = useLocation();
    const profile = useAppSelector((state) => state.player.loggedInProfile);
    const isLogin = useAppSelector((state) => state.auth.isAuth);
    const token = localStorage.getItem("token");

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Only attempt to fetch profile if token is available and profile is missing
        if (token && !profile) {
            dispatch(setToken(token));
            dispatch(fetchPlayerProfile())
                .unwrap()
                .then(() => setLoading(false)) // Profile successfully loaded
                .catch((error) => {
                    console.error("Failed to fetch profile:", error);
                    dispatch(logout());
                    setLoading(false); // Stop loading even on failure
                });
        } else {
            // No token or profile already loaded
            setLoading(false);
        }
    }, [dispatch, token, profile]);

    if (loading) {
        return <CircularProgress />; // Loading screen while waiting for profile fetch
    }

    const hideNavBar = location.pathname === "/login" || location.pathname === "/register";

    return (
        <>
            {!hideNavBar && <NavBar />}
            <Routes>
                <Route
                    path="*"
                    element={<div>404 Not Found</div>} />
                <Route
                    path="/"
                    element={<Home />} />
                <Route
                    path="/login"
                    element={isLogin && profile ? <Navigate to="/" /> : <Login />}
                />
                <Route
                    path="/register"
                    element={<Register />} />
                <Route element={<AuthGuard redirectTo="/login" />}>
                    <Route path="/my-tournaments" element={<MyTournaments />} />
                    <Route path="/profile" element={<Profile profile={profile!} />} />
                </Route>
                <Route
                    path="/player-view"
                    element={<PlayerView />} />
                <Route
                    path="/api/v1/auth/verify-email"
                    element={<VerifyEmail />} />
                <Route
                    path="/tournament/:tournamentId"
                    element={<TournamentPage />} />
            </Routes>
        </>
    );
}

function RouterPage() {
    return (
        <BrowserRouter>
            <AppContent />
        </BrowserRouter>
    );
}

export default RouterPage;
