import React from 'react';
import { Route, Navigate } from 'react-router-dom';

import TextStyleScreen from "../screens/cv-video/TextStyleScreen";
import QuestionScreen from "../screens/cv-video/QuestionScreen";
import ThemeScreen from "../screens/cv-video/ThemeScreen";
import MusicScreen from "../screens/cv-video/MusicScreen";
import RecordScreen from "../screens/cv-video/RecordScreen";
import ReviewScreen from "../screens/cv-video/ReviewScreen";
import PostScreen from "../screens/cv-video/PostScreen";
import CvVideoScreen from '../screens/cv-video/CvVideoScreen';
import GreenFilterScreen from '../screens/cv-video/GreenFilterScreen';
import { Token } from '../models/User';

const CvVideoRoutes = ({ token }: Token): JSX.Element[] => [
    <Route key="questions" path="/questions" element={token ? <QuestionScreen /> : <Navigate to="/welcome" />} />,
    <Route key="themes" path="/themes" element={token ? <ThemeScreen /> : <Navigate to="/welcome" />} />,
    <Route key="greenFilters" path="/greenFilters" element={token ? <GreenFilterScreen /> : <Navigate to="/welcome" />} />,
    <Route key="textStyles" path="/textStyles" element={token ? <TextStyleScreen /> : <Navigate to="/welcome" />} />,
    <Route key="musics" path="/musics" element={token ? <MusicScreen /> : <Navigate to="/welcome" />} />,
    <Route key="record" path="/record" element={token ? <RecordScreen /> : <Navigate to="/welcome" />} />,
    <Route key="review" path="/review" element={token ? <ReviewScreen /> : <Navigate to="/welcome" />} />,
    <Route key="post" path="/post" element={token ? <PostScreen /> : <Navigate to="/welcome" />} />,
    <Route key="cvVideo" path="/cvVideo" element={token ? <CvVideoScreen /> : <Navigate to="/welcome" />} />
];

export default CvVideoRoutes;
