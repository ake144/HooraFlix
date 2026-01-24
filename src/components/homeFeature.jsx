import { useState } from 'react'
import { FiPlay, FiChevronLeft, FiChevronRight } from 'react-icons/fi'
import './FeaturedSection.css'
import { useNavigate } from 'react-router-dom';

const FeatureSection = ({ featuredContent, onVideoClick }) => {

    const data = {
    id: 1,
    title: "HooraFlix waitlist",
    description: "Join the HooraFlix waitlist to be the first to experience our exclusive streaming service, featuring a curated selection of movies and shows.",
    image: '/hoora4.jpg',
    thumbnail: "/hoora4.jpg",
    }
  const [currentIndex, setCurrentIndex] = useState(0)
  const currentItem = featuredContent[currentIndex] || featuredContent[0]
    const navigate = useNavigate();

  if (!featuredContent || featuredContent.length === 0) return null

  
  const onMoreInfoClicked=()=>{
    navigate('/founders');
}

const unlockClicked=()=>{
    navigate('/signup');
}

  return (
    <div className="featured-section">
      <div 
        className="featured-background"
        style={{
          backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.95) 100%), url(${data.image || data.thumbnail})`
        }}
      >
        <div className="featured-content">
          <div className="featured-info">
            <p className="featured-hero-tag">Founder Signal</p>
            <h1 className="featured-title"></h1>
            {/* <p className="featured-description">Curated moments from the hoora3 sessions—feel the pulse, then decide to join the Founders Circle.</p> */}
            <div className="featured-actions">
              <button 
                className="featured-btn play-btn"
                onClick={() => unlockClicked()}
              >
                <FiPlay /> Unlock the Premiere
              </button>
              <button className="featured-btn more-btn"
                onClick={() => onMoreInfoClicked()}
              >
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

