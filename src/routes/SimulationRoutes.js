import React from "react";
import { Route, Navigate } from "react-router-dom";
import InterviewSimulation from "../screens/simulation/InterviewSimulation";

const SimulationRoutes = ({ token }) => [
  <Route
    key="train"
    path="/train"
    element={token ? <InterviewSimulation /> : <Navigate to="/welcome" />}
  />,
];

export default SimulationRoutes;
