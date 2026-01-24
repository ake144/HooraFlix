import { useState } from 'react'
import Header from '../components/Header'
import ComingSoon from '../components/ComingSoon'
import Footer from '../components/Footer'
import VideoModal from '../components/VideoModal'
import { moviesData } from '../data/moviesData'
import { showsData } from '../data/showsData'
import './Home.css'
import FeatureSection from '../components/homeFeature'

function Home() {
  const [selectedVideo, setSelectedVideo] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)


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
        <FeatureSection />
        
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
