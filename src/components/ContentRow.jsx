import { useRef } from 'react'
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'
import VideoCard from './VideoCard'
import './ContentRow.css'

const ContentRow = ({ title, videos, onVideoClick }) => {
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
    <div className="content-row">
      <h2 className="row-title">{title}</h2>
      <div className="row-container">
        <button 
          className="scroll-button left" 
          onClick={() => scroll('left')}
          aria-label="Scroll left"
        >
          <FiChevronLeft />
        </button>
        <div className="row-content" ref={rowRef}>
          {videos.map((video) => (
            <VideoCard
              key={video.id}
              video={video}
              onClick={() => onVideoClick(video)}
            />
          ))}
        </div>
        <button 
          className="scroll-button right" 
          onClick={() => scroll('right')}
          aria-label="Scroll right"
        >
          <FiChevronRight />
        </button>
      </div>
    </div>
  )
}

export default ContentRow


