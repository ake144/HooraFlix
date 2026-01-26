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
  const [heroMovies, setHeroMovies] = useState([])
  const [trendingMovies, setTrendingMovies] = useState([])
  const [newReleases, setNewReleases] = useState([])
 const [featuredBlockMovie, setFeaturedBlockMovie] = useState(null)
  useEffect(() => {
    // Select hero movies (trending ones) instead of just one
    const heroes = moviesData.filter(m => m.category === 'trending' || m.featured).slice(0, 5)
    setHeroMovies(heroes)
    setFeaturedMovie(heroes[0])

    const midFeature = moviesData.find(m => m.title === "Bilen 2026") || moviesData[2]

    setTrendingMovies(moviesData)
    setNewReleases(moviesData)
    // setDealMovies(moviesData)
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
        movies={heroMovies} 
        onPlayClick={handlePlayClick} 
      />

      <div className="sections-container">
        <ContentRow 
            title="Trending Movies" 
            videos={trendingMovies} 
            onVideoClick={handlePlayClick}
        />
        
        {/* <ContentRow 
            title="New Release" 
            videos={newReleases} 
            onVideoClick={handlePlayClick}
        /> */}

        <FeaturedBlock 
            movie={featuredBlockMovie}
            onPlayClick={handlePlayClick}
        />

        {/* <ContentRow 
            title="Deal of the Week" 
            videos={dealMovies} 
            onVideoClick={handlePlayClick}
        /> */}
      </div>

      <Footer />
    </div>
  )
}

export default Home

