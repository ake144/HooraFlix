import { useState, useEffect } from 'react'
import { FiPlay } from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'
import './FeaturedSection.css'

const FeatureSection = ({ featuredContent = [] }) => {
  const navigate = useNavigate()
  const heroImage = featuredContent[0]?.image || '/hoora4.jpg'

  const [timeLeft, setTimeLeft] = useState({
    weeks: 0,
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  })

  useEffect(() => {
    // Set target date (example: 30 days from now)
    const targetDate = new Date()
    targetDate.setDate(targetDate.getDate() + 30)

    const calculateTimeLeft = () => {
      const now = new Date().getTime()
      const difference = targetDate.getTime() - now

      if (difference > 0) {
        const weeks = Math.floor(difference / (1000 * 60 * 60 * 24 * 7))
        const days = Math.floor((difference % (1000 * 60 * 60 * 24 * 7)) / (1000 * 60 * 60 * 24))
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
        const seconds = Math.floor((difference % (1000 * 60)) / 1000)

        setTimeLeft({ weeks, days, hours, minutes, seconds })
      } else {
        setTimeLeft({ weeks: 0, days: 0, hours: 0, minutes: 0, seconds: 0 })
      }
    }

    calculateTimeLeft()
    const timer = setInterval(calculateTimeLeft, 1000)

    return () => clearInterval(timer)
  }, [])

  const formatTime = (value) => {
    return value.toString().padStart(2, '0')
  }

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
            <h1 className="coming-soon-hero-text">HOORAFLIX IS COMING</h1>
            <p className="featured-hero-tag">PRE-LAUNCH ACCESS</p>
            
            <div className="hero-countdown">
              <div className="time-unit">
                <span className="time-value">{formatTime(timeLeft.weeks)}</span>
                <span className="time-label">WKS</span>
              </div>
              <div className="time-unit">
                <span className="time-value">{formatTime(timeLeft.days)}</span>
                <span className="time-label">DAYS</span>
              </div>
              <div className="time-unit">
                <span className="time-value">{formatTime(timeLeft.hours)}</span>
                <span className="time-label">HRS</span>
              </div>
              <div className="time-unit">
                <span className="time-value">{formatTime(timeLeft.minutes)}</span>
                <span className="time-label">MIN</span>
              </div>
              <div className="time-unit">
                <span className="time-value">{formatTime(timeLeft.seconds)}</span>
                <span className="time-label">SEC</span>
              </div>
            </div>

            <div className="featured-actions">
              <button className="featured-btn play-btn" onClick={unlockClicked}>
                Get Early Access
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FeatureSection

