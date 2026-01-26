import { useState, useEffect, useRef } from 'react'
import { FiPlay, FiPlus, FiVolume2, FiVolumeX, FiInfo, FiChevronLeft, FiChevronRight } from 'react-icons/fi'
import './Hero.css'

const Hero = ({ movies, onPlayClick }) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isMuted, setIsMuted] = useState(true)
  const videoRef = useRef(null)

  const movie = movies && movies.length > 0 ? movies[currentIndex] : null

  useEffect(() => {
    if (videoRef.current) {
        videoRef.current.load();
        // Attempt to play automatically
        videoRef.current.play().catch(error => {
            console.log("Autoplay prevented:", error);
        });
    }
  }, [movie]);

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted
      setIsMuted(!isMuted)
    }
  }

  const handleNext = () => {
    if (currentIndex < movies.length - 1) {
      setCurrentIndex(prev => prev + 1)
    }
  }

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1)
    }
  }

  if (!movie) return null

  return (
    <div className="hero-section">
      <div className="hero-background-container">
        {movie.video ? (
             <video
                ref={videoRef}
                className="hero-video"
                poster={movie.image}
                autoPlay
                loop
                muted={isMuted}
                playsInline
                controls={false}
             >
                 <source src={movie.video} type="video/mp4" />
             </video>
        ) : (
             <div 
                className="hero-image"
                style={{ backgroundImage: `url(${movie.image})` }}
             ></div>
        )}
        <div className="hero-overlay-gradient"></div>
        <div className="hero-overlay-vignette"></div>
      </div>

      {currentIndex > 0 && (
        <button className="hero-nav-btn left" onClick={handlePrev}>
          <FiChevronLeft />
        </button>
      )}

      {currentIndex < movies.length - 1 && (
        <button className="hero-nav-btn right" onClick={handleNext}>
          <FiChevronRight />
        </button>
      )}

      <div className="hero-content">
        <div className="hero-meta-top">
             <span className="genre-tags">{movie.genre}</span>
        </div>
        
        <h1 className="hero-title">{movie.title}</h1>
        
        <div className="hero-meta">
          <span className="rating-star">★ {movie.rating}</span>
          <span className="meta-divider">•</span>
          <span>{movie.year}</span>
          <span className="meta-divider">•</span>
          <span>{movie.duration}</span>
          <span className="meta-tag">{movie.maturity}</span>
        </div>

        <p className="hero-description">{movie.description}</p>

        <div className="hero-actions">
          <button className="hero-btn play-btn" onClick={() => onPlayClick(movie)}>
            <FiPlay className="btn-icon" /> Play Now
          </button>
          <button className="hero-btn watchlist-btn">
            <FiPlus className="btn-icon" /> Watch Later
          </button>
        </div>
      </div>
        
        {movie.video && (
             <button className="mute-btn" onClick={toggleMute}>
                {isMuted ? <FiVolumeX /> : <FiVolume2 />}
            </button>
        )}
      
      <div className="hero-pagination">
          {currentIndex + 1} <span className="pagination-line"></span> {movies.length}
      </div>
    </div>
  )
}

export default Hero



