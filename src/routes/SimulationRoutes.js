import React from 'react';
import { Route, Navigate } from 'react-router-dom';
import Record from '../screens/simulation/Record';
import Review from '../screens/simulation/Review';
import Train from '../screens/simulation/Train';
import GreenFilters from '../screens/simulation/GreenFilters';
import Beginner from '../screens/simulation/Beginner';
import Intermediate from '../screens/simulation/Intermediate';
import Expert from '../screens/simulation/Expert';
import Evaluation from '../screens/simulation/Evaluation';

const SimulationRoutes = ({ token }) => [
    <Route key="beginner" path="/beginner" element={token ? <Beginner /> : <Navigate to="/welcome" />} />,
    <Route key="intermediate" path="/intermediate" element={token ? <Intermediate /> : <Navigate to="/welcome" />} />,
    <Route key="expert" path="/expert" element={token ? <Expert /> : <Navigate to="/welcome" />} />,
    <Route key="evaluation" path="/evaluation" element={token ? <Evaluation /> : <Navigate to="/welcome" />} />,
    <Route key="recordS" path="/recordS" element={token ? <Record /> : <Navigate to="/welcome" />} />,
    <Route key="reviewS" path="/reviewS" element={token ? <Review /> : <Navigate to="/welcome" />} />,
    <Route key="greenFiltersS" path="/greenFiltersS" element={token ? <GreenFilters /> : <Navigate to="/welcome" />} />,
    <Route key="train" path="/train" element={token ? <Train /> : <Navigate to="/welcome" />} />
];

export default SimulationRoutes;
