import React from 'react';
import { Route, Navigate } from 'react-router-dom';
import Resume from '../screens/resume/Resume';
import Customization from '../screens/resume/Customization';
import PersonalInfo from '../screens/resume/PersonalInfo';
import SkillsAndLanguages from '../screens/resume/SkillsAndLanguages';
import SmartGeneration from '../screens/resume/SmartGeneration';
import Finalization from '../screens/resume/Finalization';


const ResumeRoutes = ({ token }) => [
    <Route key="resume" path="/resume" element={token ? <Resume /> : <Navigate to="/welcome" />} />,
    <Route key="personnalization" path="/personnalization" element={token ? <Customization /> : <Navigate to="/welcome" />} />,
    <Route key="personalInfo" path="/personalInfo" element={token ? <PersonalInfo /> : <Navigate to="/welcome" />} />,
    <Route key="skillsAndLanguages" path="/skillsAndLanguages" element={token ? <SkillsAndLanguages /> : <Navigate to="/welcome" />} />,
    <Route key="smartGeneration" path="/smartGeneration" element={token ? <SmartGeneration /> : <Navigate to="/welcome" />} />,
    <Route key="finalization" path="/finalization" element={token ? <Finalization /> : <Navigate to="/welcome" />} />,
];

export default ResumeRoutes;
