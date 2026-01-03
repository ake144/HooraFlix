import { useState, useEffect } from 'react'
import './ComingSoon.css'

const ComingSoon = () => {
  const [timeLeft, setTimeLeft] = useState({
    weeks: 0,
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  })

  // Set target date (example: 30 days from now)
  const targetDate = new Date()
  targetDate.setDate(targetDate.getDate() + 30)

  useEffect(() => {
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

  return (
    <div className="coming-soon-section">
      <div className="coming-soon-background">
        <div className="coming-soon-content">
          <h1 className="coming-soon-title">Coming Soon</h1>
          
          <div className="countdown-timer">
            <div className="time-unit">
              <div className="time-value">{formatTime(timeLeft.weeks)}</div>
              <div className="time-label">WEEKS</div>
            </div>
            <div className="time-unit">
              <div className="time-value">{formatTime(timeLeft.days)}</div>
              <div className="time-label">DAYS</div>
            </div>
            <div className="time-unit">
              <div className="time-value">{formatTime(timeLeft.hours)}</div>
              <div className="time-label">HOURS</div>
            </div>
            <div className="time-unit">
              <div className="time-value">{formatTime(timeLeft.minutes)}</div>
              <div className="time-label">MINUTES</div>
            </div>
            <div className="time-unit">
              <div className="time-value">{formatTime(timeLeft.seconds)}</div>
              <div className="time-label">SECONDS</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ComingSoon

