import React from 'react';
import { Route, Navigate } from 'react-router-dom';
import RecordScreen from '../screens/simulation/RecordScreen';
import ReviewScreen from '../screens/simulation/ReviewScreen';
import TrainScreen from '../screens/simulation/TrainScreen';
import BeginnerScreen from '../screens/simulation/BeginnerScreen';
import IntermediateScreen from '../screens/simulation/IntermediateScreen';
import ExpertScreen from '../screens/simulation/ExpertScreen';
import EvaluationScreen from '../screens/simulation/EvaluationScreen';
import { Token } from '../models/User';

const SimulationRoutes = ({ token }: Token): JSX.Element[] => [
    <Route key="beginner" path="/beginner" element={token ? <BeginnerScreen /> : <Navigate to="/welcome" />} />,
    <Route key="intermediate" path="/intermediate" element={token ? <IntermediateScreen /> : <Navigate to="/welcome" />} />,
    <Route key="expert" path="/expert" element={token ? <ExpertScreen /> : <Navigate to="/welcome" />} />,
    <Route key="evaluation" path="/evaluation" element={token ? <EvaluationScreen /> : <Navigate to="/welcome" />} />,
    <Route key="recordS" path="/recordS" element={token ? <RecordScreen /> : <Navigate to="/welcome" />} />,
    <Route key="reviewS" path="/reviewS" element={token ? <ReviewScreen /> : <Navigate to="/welcome" />} />,
    <Route key="train" path="/train" element={token ? <TrainScreen /> : <Navigate to="/welcome" />} />
];

export default SimulationRoutes;
