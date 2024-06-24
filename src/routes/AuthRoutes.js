import React from 'react';
import { Route, Navigate } from 'react-router-dom';
import Login from '../screens/auth/Login';
import Register from '../screens/auth/Register';

const AuthRoutes = ({ token }) => [
    <Route key="login" path="/login" element={!token ? <Login /> : <Navigate to="/" />} />,
    <Route key="register" path="/register" element={!token ? <Register /> : <Navigate to="/" />} />,
];

export default AuthRoutes;
