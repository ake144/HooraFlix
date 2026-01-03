import { useNavigate } from 'react-router-dom'
import { FiPlay } from 'react-icons/fi'
import './RelatedShows.css'

const RelatedShows = ({ shows }) => {
  const navigate = useNavigate()
  
  if (!shows || shows.length === 0) return null

  const handleShowClick = (showId) => {
    navigate(`/episode/${showId}/1/1`)
  }

  return (
    <div className="related-shows">
      <div className="related-shows-grid">
        {shows.map((show) => (
          <div key={show.id} className="related-show-card" onClick={() => handleShowClick(show.id)}>
            <div className="related-show-thumbnail">
              <img src={show.thumbnail} alt={show.title} />
              <div className="related-show-overlay">
                <button className="related-play-btn" onClick={(e) => { e.stopPropagation(); handleShowClick(show.id); }}>
                  <FiPlay />
                </button>
              </div>
            </div>
            <div className="related-show-info">
              <h3 className="related-show-title">{show.title}</h3>
              <p className="related-show-genre">{show.genre}</p>
              <button className="related-play-now-btn" onClick={(e) => { e.stopPropagation(); handleShowClick(show.id); }}>
                <FiPlay /> Play Now
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default RelatedShows

