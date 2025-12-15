import React from 'react';
import { Route, Navigate } from 'react-router-dom';
import Resume from '../screens/resume/Resume';
import Personnalization from '../screens/resume/Personnalization';
import PersonalInfo from '../screens/resume/PersonalInfo';
import SkillsAndLanguages from '../screens/resume/SkillsAndLanguages';


const ResumeRoutes = ({ token }) => [
    <Route key="resume" path="/resume" element={token ? <Resume /> : <Navigate to="/welcome" />} />,
    <Route key="personnalization" path="/personnalization" element={token ? <Personnalization /> : <Navigate to="/welcome" />} />,
    <Route key="personalInfo" path="/personalInfo" element={token ? <PersonalInfo /> : <Navigate to="/welcome" />} />,
    <Route key="skillsAndLanguages" path="/skillsAndLanguages" element={token ? <SkillsAndLanguages /> : <Navigate to="/welcome" />} />,
];

export default ResumeRoutes;
