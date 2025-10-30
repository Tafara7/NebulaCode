import React from 'react';
import { Routes, Route } from 'react-router-dom';
import SplashPage from './pages/SplashPage';
import HomePage from './pages/HomePage';
import ProfilePage from './pages/ProfilePage';
import ProjectPage from './pages/ProjectPage';
import ProjectsPage from './pages/ProjectsPage'; 
import SignupPage from './pages/SignupPage';
import LoginPage from './pages/LoginPage';
import ProtectedRoute from './components/ProtectedRoute';

const App = () => (
  <Routes>
    <Route path="/" element={<SplashPage />} />
    <Route path="/Home" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
    <Route path="/profile/:username" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
    <Route path="/Projects" element={<ProtectedRoute><ProjectsPage /></ProtectedRoute>} />
    <Route path="/Projects/:projectId" element={<ProtectedRoute><ProjectPage /></ProtectedRoute>} />
    <Route path="/signup" element={<SignupPage />} />
    <Route path="/login" element={<LoginPage />} />
  </Routes>
);

export default App;