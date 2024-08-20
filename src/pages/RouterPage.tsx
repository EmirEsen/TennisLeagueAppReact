
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import Login from "./auth/Login";
import Register from "./auth/Register";
import Profile from "./Profile";
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { logout, setToken } from "../store/feature/authSlice";
import { AppDispatch, useAppSelector } from "../store";
import { fetchPlayerProfile } from "../store/feature/playerSlice";
import { IPlayerProfile } from "../models/IPlayerProfile";
import Home from "./Home";


function RouterPage() {
    const dispatch = useDispatch<AppDispatch>();
    const [profile, setProfile] = useState<IPlayerProfile | null>(null);
    // const profile = useAppSelector((state) => state.player.loggedInProfile);
    const [loading, setLoading] = useState(true);
    const isLogin = useAppSelector((state) => state.auth.isAuth);
    const token = localStorage.getItem('token');

    useEffect(() => {
        if (token) {
            dispatch(setToken(token));
            dispatch(fetchPlayerProfile())
                .unwrap()
                .then(data => {
                    setProfile(data);
                    setLoading(false);
                })
                .catch(error => {
                    console.error('Failed to fetch profile:', error);
                    dispatch(logout());
                    setLoading(false);
                });
        } else {
            setLoading(false);
        }
    }, [dispatch, token]);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route
                    path="/login"
                    element={isLogin && profile ? <Navigate to={'/profile'} /> : <Login />}
                />
                <Route
                    path="/register"
                    element={<Register />} />
                <Route
                    path="/profile"
                    element={isLogin ? (profile ? <Profile profile={profile} /> : <div>Loading profile...</div>) : <Navigate to="/login" />} />
            </Routes>
        </BrowserRouter>
    );
}

export default RouterPage;

