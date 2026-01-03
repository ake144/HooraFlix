import { useState } from 'react'
import { FiPlay, FiChevronLeft, FiChevronRight } from 'react-icons/fi'
import './FeaturedSection.css'

const FeaturedSection = ({ featuredContent, onVideoClick }) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const currentItem = featuredContent[currentIndex] || featuredContent[0]

  if (!featuredContent || featuredContent.length === 0) return null

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % featuredContent.length)
  }

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + featuredContent.length) % featuredContent.length)
  }

  return (
    <div className="featured-section">
      <div 
        className="featured-background"
        style={{
          backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.8) 100%), url(${currentItem?.image || currentItem?.thumbnail})`
        }}
      >
        <button className="featured-nav-btn prev" onClick={prevSlide}>
          <FiChevronLeft />
        </button>
        <button className="featured-nav-btn next" onClick={nextSlide}>
          <FiChevronRight />
        </button>
        
        <div className="featured-content">
          <div className="featured-info">
            <h1 className="featured-title">{currentItem?.title}</h1>
            <div className="featured-meta">
              <span>{currentItem?.year}</span>
              <span className="rating-badge">{currentItem?.rating}</span>
              <span>{currentItem?.duration}</span>
              <span>{currentItem?.genre}</span>
            </div>
            <p className="featured-description">{currentItem?.description}</p>
            <div className="featured-actions">
              <button 
                className="featured-btn play-btn"
                onClick={() => onVideoClick(currentItem)}
              >
                <FiPlay /> Play Now
              </button>
              <button className="featured-btn more-btn">
                More Info
              </button>
            </div>
          </div>
        </div>
        
        <div className="featured-indicators">
          {featuredContent.map((_, index) => (
            <button
              key={index}
              className={`indicator ${index === currentIndex ? 'active' : ''}`}
              onClick={() => setCurrentIndex(index)}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default FeaturedSection

