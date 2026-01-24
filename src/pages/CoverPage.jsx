import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FiPlay, FiClock, FiGrid } from 'react-icons/fi'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { showsData } from '../data/showsData'
import './CoverPage.css'

const CoverPage = () => {
  const navigate = useNavigate()
  const [selectedShow] = useState(showsData[0]) // Political Animal
  const [selectedSeason, setSelectedSeason] = useState(1)
  const [selectedEpisode, setSelectedEpisode] = useState(1)

  const currentSeason = selectedShow?.seasons.find(s => s.seasonNumber === selectedSeason)
  const currentEpisode = currentSeason?.episodes.find(e => e.episodeNumber === selectedEpisode)

  const handleEpisodeClick = (episode) => {
    setSelectedEpisode(episode.episodeNumber)
    navigate(`/episode/${selectedShow.id}/${selectedSeason}/${episode.episodeNumber}`)
  }

  if (!selectedShow) return null

  return (
    <div className="cover-page">
      <Header />
      <div className="cover-container">
        <div className="cover-main">
          <div className="video-player-section">
            <div className="video-thumbnail-large">
              <img 
                src={currentEpisode?.thumbnail || selectedShow.image} 
                alt={currentEpisode?.title || selectedShow.title}
              />
              <div className="play-overlay">
                <button 
                  className="play-button-large"
                  onClick={() => navigate(`/episode/${selectedShow.id}/${selectedSeason}/${selectedEpisode}`)}
                >
                  <FiPlay />
                </button>
              </div>
            </div>
          </div>

          <div className="episode-sidebar">
            <div className="sidebar-header">
              <h1 className="show-title-sidebar">{selectedShow.title}</h1>
              <div className="season-selector-sidebar">
                <button className="season-dropdown">
                  Season {selectedSeason}
                  <span className="dropdown-arrow">▼</span>
                </button>
                <div className="episodes-header">
                  <span>Episodes 1-{currentSeason?.episodes.length || 0}</span>
                  <button className="view-toggle">
                    <FiGrid />
                  </button>
                </div>
              </div>
            </div>

            <div className="episodes-list">
              {currentSeason?.episodes.map((episode) => (
                <div
                  key={episode.id}
                  className={`episode-item-sidebar ${selectedEpisode === episode.episodeNumber ? 'active' : ''}`}
                  onClick={() => handleEpisodeClick(episode)}
                >
                  <div className="episode-thumbnail-small">
                    <img src={episode.thumbnail} alt={episode.title} />
                  </div>
                  <div className="episode-details-sidebar">
                    <div className="episode-time-small">
                      <FiClock /> {episode.duration}
                    </div>
                    <div className="episode-code-small">
                      S{selectedSeason.toString().padStart(2, '0')}E{episode.episodeNumber.toString().padStart(2, '0')}
                    </div>
                    <div className="episode-title-sidebar">{episode.title}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default CoverPage

