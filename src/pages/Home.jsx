import Header from '../components/Header'
import Footer from '../components/Footer'
import './Home.css'
import FeatureSection from '../components/homeFeature'

function Home() {
  return (
    <div className="home-page">
      <Header />
      <div className="home-container">
        <FeatureSection />
      </div>
      <Footer />
    </div>
  )
}

export default Home
