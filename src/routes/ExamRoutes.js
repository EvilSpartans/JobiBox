import React from 'react';
import { Route, Navigate } from 'react-router-dom';

import Record from '../screens/exam/Record';
import Review from '../screens/exam/Review';
import GreenFilters from '../screens/exam/GreenFilters';
import Exam from '../screens/exam/Exam';


const ExamRoutes = ({ token }) => [
    <Route key="recordE" path="/recordE" element={token ? <Record /> : <Navigate to="/welcome" />} />,
    <Route key="reviewE" path="/reviewE" element={token ? <Review /> : <Navigate to="/welcome" />} />,
    <Route key="greenFiltersE" path="/greenFiltersE" element={token ? <GreenFilters /> : <Navigate to="/welcome" />} />,
    <Route key="exam" path="/exam" element={token ? <Exam /> : <Navigate to="/welcome" />} />,
];

export default ExamRoutes;
