import React from 'react';
import { Route, Navigate } from 'react-router-dom';

import CareerScreen from '../screens/career/CareerScreen';

const CareerRoutes = ({ token }) => [
    <Route key="career" path="/career" element={token ? <CareerScreen /> : <Navigate to="/welcome" />} />
];

export default CareerRoutes;
