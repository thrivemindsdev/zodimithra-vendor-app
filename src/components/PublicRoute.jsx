import React from 'react';
import { Navigate } from 'react-router-dom';
import { useGetUserDetailsQuery } from '../redux/api/authApi';
import Loading from '../pages/Loading/Loading';

export default function PublicRoute({ children }) {
    const token = localStorage.getItem('token');

    const { data, error, isLoading } = useGetUserDetailsQuery(undefined, {
        skip: !token,
    });

    if (!token) {
        return children;
    }

    if (isLoading) {
        return <Loading />;
    }

    if (error) {
        // Token exists but is invalid, let them view the public route
        return children;
    }

    const userData = data?.data || data;
    const onboardingCompleted = userData?.onboarding_completed;

    if (!onboardingCompleted) {
        return <Navigate to="/onboarding" replace />;
    }

    return <Navigate to="/" replace />;
}
