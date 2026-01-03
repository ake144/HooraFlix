import { useRef } from 'react'
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'
import VideoCard from './VideoCard'
import './ContentGrid.css'

const ContentGrid = ({ title, videos, onVideoClick, compact = false }) => {
  const rowRef = useRef(null)

  const scroll = (direction) => {
    if (rowRef.current) {
      const scrollAmount = 600
      rowRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      })
    }
  }

  if (!videos || videos.length === 0) return null

  return (
    <div className={`content-grid-section ${compact ? 'compact' : ''}`}>
      <div className="grid-header">
        <h2 className="grid-title">{title}</h2>
      </div>
      <div className="grid-container">
        <button 
          className="grid-scroll-btn left" 
          onClick={() => scroll('left')}
          aria-label="Scroll left"
        >
          <FiChevronLeft />
        </button>
        <div className="grid-content" ref={rowRef}>
          {videos.map((video) => (
            <VideoCard
              key={video.id}
              video={video}
              onClick={() => onVideoClick(video)}
            />
          ))}
        </div>
        <button 
          className="grid-scroll-btn right" 
          onClick={() => scroll('right')}
          aria-label="Scroll right"
        >
          <FiChevronRight />
        </button>
      </div>
    </div>
  )
}

export default ContentGrid

