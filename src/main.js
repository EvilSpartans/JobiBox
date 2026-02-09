import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'
import { Provider, useSelector } from 'react-redux';
import { Store } from './store/Store';
import { HashRouter as Router, Routes, Navigate } from "react-router-dom";
import OnlineStatus from "./components/core/OnlineStatus";
import AuthRoutes from "./routes/AuthRoutes";
import CvVideoRoutes from "./routes/CvVideoRoutes";
import CoreRoutes from "./routes/CoreRoutes";
import SimulationRoutes from "./routes/SimulationRoutes";
import ExamRoutes from "./routes/ExamRoutes";
import OfferRoutes from "./routes/OfferRoutes";
import CareerRoutes from "./routes/CareerRoutes";
import ResumeRoutes from './routes/ResumeRoutes';

export default function App() {
    const user = useSelector((state) => state.user.user);
    const { token } = user;

    return (
        <Router>
            <OnlineStatus>
                {(isOnline) => (
                    <div className={`dark ${isOnline ? '' : 'offline'}`}>
                        {!isOnline && <Navigate to="/offline" />}
                        <Routes>
                            {AuthRoutes({ token })}
                            {CvVideoRoutes({ token })}
                            {ResumeRoutes({ token })}
                            {SimulationRoutes({ token })}
                            {ExamRoutes({ token })}
                            {CoreRoutes({ token })}
                            {OfferRoutes({ token })}
                            {CareerRoutes({ token })}
                        </Routes>
                    </div>
                )}
            </OnlineStatus>
        </Router>
    );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <Provider store={Store}>
        <App />
    </Provider>
);