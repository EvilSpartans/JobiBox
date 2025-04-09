import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { Provider, useSelector } from 'react-redux';
import { Store, RootState } from './store/Store';
import { HashRouter as Router, Routes, Navigate } from 'react-router-dom';
import OnlineStatus from './components/core/OnlineStatus';
import AuthRoutes from './routes/AuthRoutes';
import CvVideoRoutes from './routes/CVVideoRoutes';
import CoreRoutes from './routes/CoreRoutes';
import SimulationRoutes from './routes/SimulationRoutes';

function App(): JSX.Element {
  const user = useSelector((state: RootState) => state.user.user);
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
              {SimulationRoutes({ token })}
              {CoreRoutes({ token })}
            </Routes>
          </div>
        )}
      </OnlineStatus>
    </Router>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

root.render(
  <Provider store={Store}>
    <App />
  </Provider>
);
