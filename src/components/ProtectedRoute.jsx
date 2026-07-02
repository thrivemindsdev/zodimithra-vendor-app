import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useGetUserDetailsQuery } from '../redux/api/authApi';
import { setUser, logout } from '../redux/authSlice';
import Loading from '../pages/Loading/Loading';

export default function ProtectedRoute({ children }) {
    const token = localStorage.getItem('token');
    const location = useLocation();
    const dispatch = useDispatch();

    const { data, error, isLoading } = useGetUserDetailsQuery(undefined, {
        skip: !token,
    });

    const userData = data?.data || data;

    useEffect(() => {
        if (userData) {
            dispatch(setUser(userData));
        }
    }, [userData, dispatch]);

    useEffect(() => {
        if (error) {
            dispatch(logout());
        }
    }, [error, dispatch]);

    if (!token) {
        return <Navigate to="/otp" state={{ from: location }} replace />;
    }

    if (isLoading) {
        return <Loading />;
    }

    if (error) {
        return <Navigate to="/otp" state={{ from: location }} replace />;
    }

    const onboardingCompleted = userData?.onboarding_completed;

    // Save onboarding status locally to maintain compatibility with other parts of the app
    if (onboardingCompleted) {
        localStorage.setItem('onboardingCompleted', 'true');
    } else {
        localStorage.removeItem('onboardingCompleted');
    }

    if (!onboardingCompleted && location.pathname !== '/onboarding') {
        return <Navigate to="/onboarding" replace />;
    }

    if (onboardingCompleted && location.pathname === '/onboarding') {
        return <Navigate to="/" replace />;
    }

    return children;
}
