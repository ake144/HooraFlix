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
