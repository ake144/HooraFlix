import { useEffect } from 'react'
import { FiX, FiPlay, FiPlus, FiThumbsUp, FiThumbsDown } from 'react-icons/fi'
import './VideoModal.css'

const VideoModal = ({ video, onClose }) => {
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }
    document.addEventListener('keydown', handleEscape)
    document.body.style.overflow = 'hidden'
    
    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [onClose])

  if (!video) return null

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Close">
          <FiX />
        </button>
        <div 
          className="modal-hero"
          style={{
            backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.9) 100%), url(${video.image})`
          }}
        >
          <div className="modal-hero-content">
            <h1 className="modal-title">{video.title}</h1>
            <div className="modal-meta">
              <span>{video.year}</span>
              <span className="rating-badge">{video.rating}</span>
              <span>{video.duration}</span>
              <span>{video.genre}</span>
            </div>
            <p className="modal-description">{video.description}</p>
            <div className="modal-actions">
              <button className="modal-button play">
                <FiPlay /> Play
              </button>
              <button className="modal-button icon">
                <FiPlus />
              </button>
              <button className="modal-button icon">
                <FiThumbsUp />
              </button>
              <button className="modal-button icon">
                <FiThumbsDown />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default VideoModal


