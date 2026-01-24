import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import FeaturedSection from '../components/FeaturedSection'
import ContentGrid from '../components/ContentGrid'
import ComingSoon from '../components/ComingSoon'
import Footer from '../components/Footer'
import VideoModal from '../components/VideoModal'
import { moviesData } from '../data/moviesData'
import { showsData } from '../data/showsData'
import './Home.css'

function Home() {
  const navigate = useNavigate()
  const [selectedVideo, setSelectedVideo] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleVideoClick = (video) => {
    // Check if it's a show with episodes
    const show = showsData.find(s => s.id === video.id)
    if (show && show.seasons && show.seasons.length > 0) {
      navigate(`/episode/${show.id}/1/1`)
    } else {
      setSelectedVideo(video)
      setIsModalOpen(true)
    }
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setSelectedVideo(null)
  }

  const categories = [
    { 
      title: 'Featured', 
      data: moviesData.filter(m => m.featured).concat(showsData.slice(0, 3))
    }
  ]

  return (
    <div className="home-page">
      <Header />
      <section className="home-founder-callout">
        <div className="home-callout-inner">
          <div className="home-callout-text">
            <p className="home-callout-eyebrow">Founders Circle</p>
            <h2>See how founders own every premiere.</h2>
            <p>
              When the community converges, hoora3 is the still that captures the energy.
              Founders watch, vote, and lead the next spotlight—now you can be the next voice.
            </p>
            <button className="home-callout-btn" onClick={() => navigate('/founders')}>
              Unlock Founder Access
            </button>
          </div>
          <div className="home-callout-media">
            <img src="/hoora3.jpg" alt="Founder showcase" />
            <span className="home-callout-tag">Members-only premiere</span>
          </div>
        </div>
      </section>
      <div className="home-container">
        <FeaturedSection 
          featuredContent={categories[0].data}
          onVideoClick={handleVideoClick}
        />
        
        <div className="home-content">
          <ComingSoon />
        </div>
      </div>
      <Footer />
      {isModalOpen && selectedVideo && (
        <VideoModal video={selectedVideo} onClose={closeModal} />
      )}
    </div>
  )
}

export default Home
