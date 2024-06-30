import React from 'react';
import { Route, Navigate } from 'react-router-dom';

import Malfunction from "../screens/core/Malfunction";
import Offline from "../screens/core/Offline";
import Welcome from "../screens/core/Welcome";
import Config from "../screens/core/Config";
import Portal from "../screens/core/Portal";
import Thanks from "../screens/core/Thanks";
import Home from '../screens/core/Home';

const CoreRoutes = ({ token }) => [
    <Route key="home" path="/" element={token ? <Home /> : <Navigate to="/welcome" />} />,
    <Route key="config" path="/config" element={<Config />} />,
    <Route key="portal" path="/portal" element={<Portal />} />,
    <Route key="offline" path="/offline" element={<Offline />} />,
    <Route key="malfunction" path="/malfunction" element={<Malfunction />} />,
    <Route key="thanks" path="/thanks" element={token ? <Thanks /> : <Navigate to="/welcome" />} />,
    <Route key="welcome" path="/welcome" element={!token ? <Welcome /> : <Navigate to="/" />} />,
];

export default CoreRoutes;
