import React from 'react';
import { Route, Navigate } from 'react-router-dom';

import Conditions from '../screens/auth/Conditions';
import Register from '../screens/auth/Register';
import Login from '../screens/auth/Login';

const AuthRoutes = ({ token }) => [
    <Route key="login" path="/login" element={!token ? <Login /> : <Navigate to="/" />} />,
    <Route key="register" path="/register" element={!token ? <Register /> : <Navigate to="/" />} />,
    <Route key="conditions" path="/conditions" element={!token ? <Conditions /> : <Navigate to="/" />} />
];

export default AuthRoutes;
