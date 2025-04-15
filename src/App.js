// src/App.js
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import DashboardPage from './pages/DashboardPage';
import RegistrationPage from './pages/RegistrationPage';
import DirectoryPage from './pages/DirectoryPage';
import NotesPage from './pages/NotesPage';
import EventsPage from './pages/EventsPage';
import LoginPage from './pages/LoginPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<DashboardPage />} />
      <Route path="/register" element={<RegistrationPage />} />
      <Route path="/login" element={<LoginPage />} /> {/* ✅ This line is critical */}
      <Route path="/directory" element={<DirectoryPage />} />
      <Route path="/notes" element={<NotesPage />} />
      <Route path="/events" element={<EventsPage />} />
    </Routes>
  );
}

export default App;
