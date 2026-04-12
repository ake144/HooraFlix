import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import CoverPage from './pages/CoverPage';
import EpisodeDetail from './pages/EpisodeDetail';
import LiveStream from './pages/LiveStream';
import Login from './pages/Login';
import Signup from './pages/Signup';
import FoundersPage from './pages/FoundersPage';
import FoundersDashboard from './pages/FoundersDashboard';
import FounderTrainingCenter from './pages/founderDashboard/FounderTrainingCenter';
import FounderMarketingLibrary from './pages/founderDashboard/FounderMarketingLibrary';
import FounderSettings from './pages/founderDashboard/FounderSettings';
import Academy from './pages/Academy';
import Casting from './pages/Casting';
import Opportunity from './pages/Opportunity';
import Revenue from './pages/Revenue';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route 
          path="/founders" 
          element={
            <ProtectedRoute>
              <FoundersPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/founders-dashboard" 
          element={
            <ProtectedRoute requireFounder>
              <FoundersDashboard />
            </ProtectedRoute>
          } 
        />
        <Route
          path="/founders-dashboard/training"
          element={
            <ProtectedRoute requireFounder>
              <FounderTrainingCenter />
            </ProtectedRoute>
          }
        />
        <Route
          path="/founders-dashboard/materials"
          element={
            <ProtectedRoute requireFounder>
              <FounderMarketingLibrary />
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute requireFounder>
              <FounderSettings />
            </ProtectedRoute>
          }
        />
         <Route 
          path="/academy" 
          element={
            <ProtectedRoute>
              <Academy />
            </ProtectedRoute>
          } 
        />
         <Route 
          path="/casting" 
          element={
            <ProtectedRoute>
              <Casting />
            </ProtectedRoute>
          } 
        />
         <Route 
          path="/opportunity" 
          element={
            <ProtectedRoute>
              <Opportunity />
            </ProtectedRoute>
          } 
        />
         <Route 
          path="/revenue" 
          element={
            <ProtectedRoute>
              <Revenue />
            </ProtectedRoute>
          } 
        />
        <Route path="/movies" element={<CoverPage />} />
        <Route path="/episode/:showId/:seasonNumber/:episodeNumber" element={<EpisodeDetail />} />
        <Route path="/episode/:showId/:seasonNumber" element={<EpisodeDetail />} />
        <Route path="/episode/:showId" element={<EpisodeDetail />} />
        <Route path="/live-stream" element={<LiveStream />} />
      </Routes>
    </Router>
  )
}

export default App

