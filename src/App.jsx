import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import CoverPage from './pages/CoverPage'
import EpisodeDetail from './pages/EpisodeDetail'
import LiveStream from './pages/LiveStream'
import Login from './pages/Login'
import Signup from './pages/Signup'
import FoundersPage from './pages/FoundersPage'
import FoundersDashboard from './pages/FoundersDashboard'
import './App.css'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/founders" element={<FoundersPage />} />
        <Route path="/founders-dashboard" element={<FoundersDashboard />} />
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

