import React from 'react';
import { Route, Navigate } from 'react-router-dom';
import QuestionVideos from '../screens/train-exam/QuestionVideos';
import Record from '../screens/train-exam/Record';
import Review from '../screens/train-exam/Review';
import Exam from '../screens/train-exam/Exam';
import Train from '../screens/train-exam/Train';
import GreenFilters from '../screens/train-exam/GreenFilters';

const TrainExamRoutes = ({ token }) => [
    <Route key="questionVideo" path="/questionVideo" element={token ? <QuestionVideos /> : <Navigate to="/welcome" />} />,
    <Route key="recordTE" path="/recordTE" element={token ? <Record /> : <Navigate to="/welcome" />} />,
    <Route key="reviewTE" path="/reviewTE" element={token ? <Review /> : <Navigate to="/welcome" />} />,
    <Route key="exam" path="/exam" element={token ? <Exam /> : <Navigate to="/welcome" />} />,
    <Route key="greenFiltersTE" path="/greenFiltersTE" element={token ? <GreenFilters /> : <Navigate to="/welcome" />} />,
    <Route key="train" path="/train" element={token ? <Train /> : <Navigate to="/welcome" />} />
];

export default TrainExamRoutes;
