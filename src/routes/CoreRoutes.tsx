import React from 'react';
import { Route, Navigate } from 'react-router-dom';

import MalfunctionScreen from "../screens/core/MalfunctionScreen";
import OfflineScreen from "../screens/core/OfflineScreen";
import WelcomeScreen from "../screens/core/WelcomeScreen";
import ConfigScreen from "../screens/core/ConfigScreen";
import PortalScreen from "../screens/core/PortalScreen";
import ThankScreen from "../screens/core/ThankScreen";
import HomeScreen from '../screens/core/HomeScreen';
import { Token } from '../models/User';

const CoreRoutes = ({ token }: Token): JSX.Element[] => [
    <Route key="home" path="/" element={token ? <HomeScreen /> : <Navigate to="/welcome" />} />,
    <Route key="config" path="/config" element={<ConfigScreen />} />,
    <Route key="portal" path="/portal" element={<PortalScreen />} />,
    <Route key="offline" path="/offline" element={<OfflineScreen />} />,
    <Route key="malfunction" path="/malfunction" element={<MalfunctionScreen />} />,
    <Route key="thanks" path="/thanks" element={token ? <ThankScreen /> : <Navigate to="/welcome" />} />,
    <Route key="welcome" path="/welcome" element={!token ? <WelcomeScreen /> : <Navigate to="/" />} />,
];

export default CoreRoutes;
