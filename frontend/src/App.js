import React from 'react';
import { Routes, Route } from 'react-router-dom';
import SplashPage from './pages/SplashPage';
import HomePage from './pages/HomePage';
import ProfilePage from './pages/ProfilePage';
import ProjectPage from './pages/ProjectPage';
import ProjectsPage from './pages/ProjectsPage'; 
import SignupPage from './pages/SignupPage';
import LoginPage from './pages/LoginPage';

const App = () => (
  <Routes>
    <Route path="/" element={<SplashPage />} />
    <Route path="/Home" element={<HomePage />} />
    <Route path="/profile/:username" element={<ProfilePage />} />
    <Route path="/Projects" element={<ProjectsPage />} /> {/* <-- Add this */}
    <Route path="/Projects/:projectId" element={<ProjectPage />} />
    <Route path="/signup" element={<SignupPage />} />
    <Route path="/login" element={<LoginPage />} />
  </Routes>
);

export default App;