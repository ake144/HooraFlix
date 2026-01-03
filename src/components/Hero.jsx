import { FiPlay, FiInfo } from 'react-icons/fi'
import './Hero.css'

const Hero = ({ featuredVideo, onPlayClick }) => {
  if (!featuredVideo) return null

  return (
    <div className="hero">
      <div 
        className="hero-background"
        style={{
          backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.7) 100%), url(${featuredVideo.image})`
        }}
      />
      <div className="hero-content">
        <div className="hero-info">
          <h1 className="hero-title">{featuredVideo.title}</h1>
          <div className="hero-meta">
            <span className="hero-year">{featuredVideo.year}</span>
            <span className="hero-rating">{featuredVideo.rating}</span>
            <span className="hero-duration">{featuredVideo.duration}</span>
            <span className="hero-genre">{featuredVideo.genre}</span>
          </div>
          <p className="hero-description">{featuredVideo.description}</p>
          <div className="hero-buttons">
            <button className="hero-button play" onClick={onPlayClick}>
              <FiPlay /> Play
            </button>
            <button className="hero-button info">
              <FiInfo /> More Info
            </button>
          </div>
        </div>
      </div>
      <div className="hero-fade-bottom" />
    </div>
  )
}

export default Hero


