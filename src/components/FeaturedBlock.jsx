// Featured Section Component for the "Almost Adults" type block
import { FiPlay, FiPlus } from 'react-icons/fi'
import './FeaturedBlock.css'

const FeaturedBlock = ({ movie, onPlayClick }) => {
    if (!movie) return null;

    return (
        <div className="featured-block-container">
            <div 
                className="featured-block-bg"
                style={{ backgroundImage: `url(${movie.image})` }}
            >
                <div className="featured-block-overlay"></div>
            </div>
            
            <div className="featured-block-content">
                <div className="featured-block-text">
                    <h2 className="featured-block-title">{movie.title}</h2>
                    <p className="featured-block-desc">{movie.description}</p>
                    <div className="featured-block-actions">
                        <button className="featured-block-btn play" onClick={() => onPlayClick(movie)}>
                            <FiPlay /> Play Now
                        </button>
                        <button className="featured-block-btn add">
                            <FiPlus />
                        </button>
                    </div>
                </div>
                
                <div className="featured-block-media-preview">

                     <div className="media-preview-card">
                        <div className="play-icon-overlay">
                            <FiPlay size={40} />
                            <span>Watch Trailer!</span>
                        </div>
                        <img src={movie.thumbnail} alt="Trailer preview" />
                     </div>
                     <div className="media-gallery-small">
                        {/* Fake gallery thumbnails */}
                        <div className="gallery-item"></div>
                        <div className="gallery-item"></div>
                        <div className="gallery-item"></div>
                     </div>
                </div>
            </div>
        </div>
    )
}

export default FeaturedBlock;
