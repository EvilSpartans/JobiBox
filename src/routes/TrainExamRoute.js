import React from 'react';
import { Route, Navigate } from 'react-router-dom';
import QuestionVideos from '../screens/train-exam/QuestionVideos';
import Record from '../screens/train-exam/Record';
import Review from '../screens/train-exam/Review';

const TrainExamRoutes = ({ token }) => [
    <Route key="questionVideo" path="/questionVideo" element={token ? <QuestionVideos /> : <Navigate to="/welcome" />} />,
    <Route key="recordTE" path="/recordTE" element={token ? <Record /> : <Navigate to="/welcome" />} />,
    <Route key="reviewTE" path="/reviewTE" element={token ? <Review /> : <Navigate to="/welcome" />} />
];

export default TrainExamRoutes;
