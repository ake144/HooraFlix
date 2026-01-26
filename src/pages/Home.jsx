import { useState, useEffect } from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import Hero from '../components/Hero'
import ContentRow from '../components/ContentRow'
import FeaturedBlock from '../components/FeaturedBlock'
import { moviesData } from '../data/moviesData'
import './Home.css'

function Home() {
  const [featuredMovie, setFeaturedMovie] = useState(null)
  const [trendingMovies, setTrendingMovies] = useState([])
  const [newReleases, setNewReleases] = useState([])
  const [dealMovies, setDealMovies] = useState([])
  const [featuredBlockMovie, setFeaturedBlockMovie] = useState(null)

  useEffect(() => {
    // Determine the featured movie (John Wick 4 from the screenshot)
    // We can pick by ID or by `featured` flag.
    const hero = moviesData.find(m => m.title === "John Wick 4") || moviesData[0]
    setFeaturedMovie(hero)

    // Filter categories
    const trending = moviesData.filter(m => m.category === 'trending' || (m.genre && m.genre.includes('Action')))
    const releases = moviesData.filter(m => m.category === 'release' || m.year >= 2023)
    const deals = moviesData.filter(m => m.category === 'deal' || m.maturity === 'TV-14')
    
    // Featured Middle Block (Almost Adults)
    const midFeature = moviesData.find(m => m.title === "Almost Adults") || moviesData[2]

    setTrendingMovies(trending)
    setNewReleases(releases)
    setDealMovies(deals)
    setFeaturedBlockMovie(midFeature)
  }, [])

  const handlePlayClick = (movie) => {
    console.log("Playing movie:", movie ? movie.title : "Unknown")
    // Implement play logic or navigation here
  }

  return (
    <div className="home-page">
      <Header />
      
      <Hero 
        movie={featuredMovie} 
        onPlayClick={handlePlayClick} 
      />

      <div className="sections-container">
        <ContentRow 
            title="Trending Movies" 
            videos={trendingMovies} 
            onVideoClick={handlePlayClick}
        />
        
        <ContentRow 
            title="New Release" 
            videos={newReleases} 
            onVideoClick={handlePlayClick}
        />

        <FeaturedBlock 
            movie={featuredBlockMovie}
            onPlayClick={handlePlayClick}
        />

        <ContentRow 
            title="Deal of the Week" 
            videos={dealMovies} 
            onVideoClick={handlePlayClick}
        />
      </div>

      <Footer />
    </div>
  )
}

export default Home

