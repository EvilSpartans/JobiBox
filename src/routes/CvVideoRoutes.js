import React from 'react';
import { Route, Navigate } from 'react-router-dom';

import Transcription from "../screens/cv-video/Transcription";
import TextStyles from "../screens/cv-video/TextStyles";
import Questions from "../screens/cv-video/Questions";
import Themes from "../screens/cv-video/Themes";
import Musics from "../screens/cv-video/Musics";
import Record from "../screens/cv-video/Record";
import Review from "../screens/cv-video/Review";
import Post from "../screens/cv-video/Post";
import CvVideo from '../screens/cv-video/CvVideo';
import GreenFilters from '../screens/cv-video/GreenFilters';

const CvVideoRoutes = ({ token }) => [
    <Route key="questions" path="/questions" element={token ? <Questions /> : <Navigate to="/welcome" />} />,
    <Route key="themes" path="/themes" element={token ? <Themes /> : <Navigate to="/welcome" />} />,
    <Route key="greenFilters" path="/greenFilters" element={token ? <GreenFilters /> : <Navigate to="/welcome" />} />,
    <Route key="textStyles" path="/textStyles" element={token ? <TextStyles /> : <Navigate to="/welcome" />} />,
    <Route key="musics" path="/musics" element={token ? <Musics /> : <Navigate to="/welcome" />} />,
    <Route key="record" path="/record" element={token ? <Record /> : <Navigate to="/welcome" />} />,
    <Route key="review" path="/review" element={token ? <Review /> : <Navigate to="/welcome" />} />,
    <Route key="transcription" path="/transcription" element={token ? <Transcription /> : <Navigate to="/welcome" />} />,
    <Route key="post" path="/post" element={token ? <Post /> : <Navigate to="/welcome" />} />,
    <Route key="cvVideo" path="/cvVideo" element={token ? <CvVideo /> : <Navigate to="/welcome" />} />
];

export default CvVideoRoutes;
