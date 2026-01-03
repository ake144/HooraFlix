import { useState } from 'react'
import { FiPlay, FiInfo } from 'react-icons/fi'
import './VideoCard.css'

const VideoCard = ({ video, onClick }) => {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div
      className={`video-card ${isHovered ? 'hovered' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      <div className="card-image-container">
        <img 
          src={video.thumbnail || video.image} 
          alt={video.title}
          className="card-image"
        />
        {isHovered && (
          <div className="card-overlay">
            <div className="card-buttons">
              <button className="card-button play" onClick={(e) => { e.stopPropagation(); onClick(); }}>
                <FiPlay />
              </button>
              <button className="card-button info">
                <FiInfo />
              </button>
            </div>
          </div>
        )}
      </div>
      {isHovered && (
        <div className="card-info">
          <h3 className="card-title">{video.title}</h3>
          <div className="card-meta">
            <span>{video.year}</span>
            <span>{video.rating}</span>
            <span>{video.duration}</span>
          </div>
        </div>
      )}
    </div>
  )
}

export default VideoCard


