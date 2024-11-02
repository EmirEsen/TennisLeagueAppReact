import { BrowserRouter, Navigate, Route, Routes, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
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

function AppContent() {
    const dispatch = useDispatch<AppDispatch>();
    const location = useLocation();
    const profile = useAppSelector((state) => state.player.loggedInProfile);
    const isLogin = useAppSelector((state) => state.auth.isAuth);
    const token = localStorage.getItem("token");

    useEffect(() => {
        if (token) {
            dispatch(setToken(token));
            dispatch(fetchPlayerProfile())
                .unwrap()
                .catch((error) => {
                    console.error("Failed to fetch profile:", error);
                    dispatch(logout());
                });
        }
    }, [dispatch, token]);

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
                    path="/my-tournaments"
                    element={isLogin && profile ? <MyTournaments /> : <Navigate to="/login" />}
                />
                <Route
                    path="/login"
                    element={isLogin && profile ? <Navigate to="/profile" /> : <Login />}
                />
                <Route
                    path="/register"
                    element={<Register />} />
                <Route
                    path="/profile"
                    element={
                        isLogin ? (profile ? <Profile profile={profile} /> : <div>Loading profile...</div>) : <Navigate to="/login" />
                    }
                />
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
