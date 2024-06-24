import { HashRouter as Router, Routes, Navigate } from "react-router-dom";
import React from 'react';
import { useSelector } from "react-redux";

import OnlineStatus from "./components/core/OnlineStatus";
import AuthRoutes from "./routes/AuthRoutes";
import CvVideoRoutes from "./routes/CVVideoRoutes";
import CoreRoutes from "./routes/CoreRoutes";

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
                            {CoreRoutes({ token })}
                        </Routes>
                    </div>
                )}
            </OnlineStatus>
        </Router>
    );
}