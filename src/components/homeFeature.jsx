import { FiPlay } from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'
import './FeaturedSection.css'

const FeatureSection = ({ featuredContent = [] }) => {
  const navigate = useNavigate()
  const heroImage = featuredContent[0]?.image || '/hoora4.jpg'

  const onMoreInfoClicked = () => {
    navigate('/founders')
  }

  const unlockClicked = () => {
    navigate('/signup')
  }

  return (
    <div className="featured-section">
      <div
        className="featured-background"
        style={{
          backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.95) 100%), url(${heroImage})`
        }}
      >
        <div className="featured-overlay" />
        <div className="featured-content">
          <div className="featured-footer">
            <p className="featured-hero-tag">Founder Signal</p>
            <div className="featured-actions">
              <button className="featured-btn play-btn" onClick={unlockClicked}>
                <FiPlay /> Unlock the Premiere
              </button>
              <button className="featured-btn more-btn" onClick={onMoreInfoClicked}>
                Explore Founder Circle
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FeatureSection

