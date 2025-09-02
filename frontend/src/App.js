// Tafara Hwata u22565991

import React from 'react';
import { Routes, Route } from 'react-router-dom';
import SplashPage from './pages/SplashPage';
import HomePage from './pages/HomePage';
import ProfilePage from './pages/ProfilePage';
import ProjectPage from './pages/ProjectPage';



const App = () => (
  <Routes>
    <Route path="/" element={<SplashPage />} />
    <Route path="/Home" element={<HomePage />} />
    <Route path="/Profile" element={<ProfilePage />} />
    <Route path="/Projects" element={<ProjectPage />} />
  </Routes>
);

export default App;