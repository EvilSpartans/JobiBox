import { HashRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import React from 'react';
import Home from './screens/Home';
import Login from './screens/Login';
import Register from './screens/Register';
import { useSelector } from "react-redux";
import Questions from "./screens/Questions";
import Themes from "./screens/Themes";
import TextStyles from "./screens/TextStyles";
import Musics from "./screens/Musics";
import Record from "./screens/Record";
import Review from "./screens/Review";
import Post from "./screens/Post";
import Thanks from "./screens/Thanks";
import Transcription from "./screens/Transcription";
import OnlineStatus from "./components/OnlineStatus";
import Offline from "./screens/Offline";
import Config from "./screens/Config";
import Portal from "./screens/Portal";

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
                            <Route path="/" element={token ? <Home /> : <Navigate to="/login" />} />
                            <Route path="/config" element={<Config />} />
                            <Route path="/portal" element={<Portal />} />
                            <Route path="/offline" element={<Offline />} />
                            <Route path="/questions" element={token ? <Questions /> : <Navigate to="/login" />} />
                            <Route path="/themes" element={token ? <Themes /> : <Navigate to="/login" />} />
                            <Route path="/textStyles" element={token ? <TextStyles /> : <Navigate to="/login" />} />
                            <Route path="/musics" element={token ? <Musics /> : <Navigate to="/login" />} />
                            <Route path="/record" element={token ? <Record /> : <Navigate to="/login" />} />
                            <Route path="/review" element={token ? <Review /> : <Navigate to="/login" />} />
                            <Route path="/transcription" element={token ? <Transcription /> : <Navigate to="/login" />} />
                            <Route path="/post" element={token ? <Post /> : <Navigate to="/login" />} />
                            <Route path="/thanks" element={token ? <Thanks /> : <Navigate to="/login" />} />
                            <Route path="/login" element={!token ? <Login /> : <Navigate to="/" />} />
                            <Route path="/register" element={!token ? <Register /> : <Navigate to="/" />} />
                        </Routes>
                    </div>
                )}
            </OnlineStatus>
        </Router>
    );
}
