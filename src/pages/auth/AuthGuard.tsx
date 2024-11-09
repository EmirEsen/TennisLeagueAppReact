import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "../../store";
import { CircularProgress } from "@mui/material";
import { useEffect, useState } from "react";


const AuthGuard = ({ redirectTo = "/login" }) => {
    const isLogin = useAppSelector((state) => state.auth.isAuth);
    const profile = useAppSelector((state) => state.player.loggedInProfile);
    const [checkingAuth, setCheckingAuth] = useState(true);

    useEffect(() => {
        // Wait for the app to determine if the user is authenticated and has a profile
        if (isLogin && profile) {
            setCheckingAuth(false);
        } else if (!isLogin) {
            setCheckingAuth(false);
        }
    }, [isLogin, profile]);

    if (checkingAuth) {
        return <CircularProgress />; // Show loading indicator while checking auth
    }

    // If both login and profile are available, render the child routes
    return isLogin && profile ? <Outlet /> : <Navigate to={redirectTo} />;
};

export default AuthGuard;