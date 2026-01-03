import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { FiPlay, FiShare2, FiHeart, FiClock } from 'react-icons/fi'
import Header from '../components/Header'
import SeasonSelector from '../components/SeasonSelector'
import EpisodeList from '../components/EpisodeList'
import RelatedShows from '../components/RelatedShows'
import Reviews from '../components/Reviews'
import PopularShowsSidebar from '../components/PopularShowsSidebar'
import Footer from '../components/Footer'
import { showsData, popularShows } from '../data/showsData'
import './EpisodeDetail.css'

const EpisodeDetail = () => {
  const { showId, seasonNumber, episodeNumber } = useParams()
  const show = showsData.find(s => s.id === parseInt(showId))
  
  const [selectedSeason, setSelectedSeason] = useState(parseInt(seasonNumber) || 1)
  const [selectedEpisode, setSelectedEpisode] = useState(parseInt(episodeNumber) || 1)
  const [isWatchlisted, setIsWatchlisted] = useState(false)

  if (!show) {
    return <div>Show not found</div>
  }

  const currentSeason = show.seasons.find(s => s.seasonNumber === selectedSeason)
  const currentEpisode = currentSeason?.episodes.find(e => e.episodeNumber === selectedEpisode)

  return (
    <div className="episode-detail-page">
      <Header />
      <div className="episode-container">
        <div className="episode-main">
          <div className="breadcrumb">
            <Link to="/">Home</Link>
            <span>/</span>
            <Link to="/tv-shows">Tv Shows</Link>
            <span>/</span>
            <Link to={`/show/${show.id}`}>{show.genre}</Link>
            <span>/</span>
            <Link to={`/show/${show.id}`}>{show.title}</Link>
            <span>/</span>
            <span>Season {selectedSeason}</span>
            <span>/</span>
            <span>{currentEpisode?.title || 'Episode'}</span>
          </div>

          <div className="episode-header">
            <h1 className="show-title">{show.title}</h1>
            <div className="show-meta-info">
              <span className="season-badge">Season {selectedSeason}</span>
              {currentEpisode && (
                <>
                  <span className="episode-title">{currentEpisode.title}</span>
                </>
              )}
            </div>
          </div>

          <SeasonSelector
            seasons={show.seasons}
            selectedSeason={selectedSeason}
            onSeasonChange={setSelectedSeason}
          />

          <EpisodeList
            episodes={currentSeason?.episodes || []}
            selectedEpisode={selectedEpisode}
            onEpisodeSelect={setSelectedEpisode}
            seasonNumber={selectedSeason}
          />

          {currentEpisode && (
            <div className="episode-content">
              <div className="video-section">
                <div className="video-player-container">
                  <div className="video-placeholder">
                    <div className="play-button-large">
                      <FiPlay />
                    </div>
                    <p>Video Player</p>
                  </div>
                </div>
                
                <div className="episode-actions">
                  <button className="action-btn play-btn">
                    <FiPlay /> Play Now
                  </button>
                  <button 
                    className={`action-btn watchlist-btn ${isWatchlisted ? 'active' : ''}`}
                    onClick={() => setIsWatchlisted(!isWatchlisted)}
                  >
                    {isWatchlisted ? 'Watchlisted' : 'Watchlist'}
                  </button>
                  <button className="action-btn share-btn">
                    <FiShare2 /> Share
                  </button>
                </div>

                <div className="episode-stats">
                  <span>{show.views} Views</span>
                  <span>Tags: {show.tags.join(', ')}</span>
                  <span>{show.likes} likes</span>
                </div>
              </div>

              <div className="episode-info-section">
                <h2>More Shows like this</h2>
                <RelatedShows shows={show.relatedShows} />
              </div>

              <Reviews showId={show.id} />
            </div>
          )}
        </div>

        <div className="episode-sidebar">
          <PopularShowsSidebar shows={popularShows} />
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default EpisodeDetail

