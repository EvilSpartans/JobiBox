import React from 'react';
import { Route, Navigate } from 'react-router-dom';

import OfferScreen from '../screens/offer/OfferScreen';

const OfferRoutes = ({ token }) => [
    <Route key="offers" path="/offers" element={token ? <OfferScreen /> : <Navigate to="/welcome" />} />
];

export default OfferRoutes;
