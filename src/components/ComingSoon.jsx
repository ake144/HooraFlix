import { useState, useEffect } from 'react'
import './ComingSoon.css'

const ComingSoon = () => {
  const [timeLeft, setTimeLeft] = useState({
    months: 0,
    weeks: 0,
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  })

 
  // Set target to roughly 1 month and 2 weeks from now for demo
  const targetDate = new Date()
  targetDate.setDate(targetDate.getDate() + 30)

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime()
      const difference = targetDate.getTime() - now

      if (difference > 0) {
        const months = Math.floor(difference / (1000 * 60 * 60 * 24 * 30))
        const remainingAfterMonths = difference % (1000 * 60 * 60 * 24 * 30)
        
        const weeks = Math.floor(remainingAfterMonths / (1000 * 60 * 60 * 24 * 7))
        const remainingAfterWeeks = remainingAfterMonths % (1000 * 60 * 60 * 24 * 7)
        
        const days = Math.floor(remainingAfterWeeks / (1000 * 60 * 60 * 24))
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
        const seconds = Math.floor((difference % (1000 * 60)) / 1000)

        setTimeLeft({ months, weeks, days, hours, minutes, seconds })
      } else {
        setTimeLeft({ months: 0, weeks: 0, days: 0, hours: 0, minutes: 0, seconds: 0 })
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
      <div className="coming-soon-background"></div>
      
      <div className="coming-soon-content">
                
        <div className="timer-container-split">
          {/* Left Side: Time (Clock Style) */}
          <div className="timer-group left-group">

            <div className="time-unit">
              <div className="time-value">{formatTime(timeLeft.months)}</div>
              <div className="time-label">MONTHS</div>
            </div>
             <div className="colon">:</div>
            <div className="time-unit">
              <div className="time-value">{formatTime(timeLeft.weeks)}</div>
              <div className="time-label">WEEKS</div>
            </div>
            <div className="colon">:</div>
            <div className="time-unit">
              <div className="time-value">{formatTime(timeLeft.days)}</div>
              <div className="time-label">DAYS</div>
            </div>

           
          </div>

          {/* Spacer for Image Visibility */}
          <div className="spacer"></div>

          {/* Right Side: Date Units (Similar Style) */}
          <div className="timer-group right-group">
              <div className="time-unit">
              <div className="time-value">{formatTime(timeLeft.hours)}</div>
              <div className="time-label">HOURS</div>
            </div>
            <div className="colon">:</div>
            <div className="time-unit">
              <div className="time-value">{formatTime(timeLeft.minutes)}</div>
              <div className="time-label">MINUTES</div>
            </div>
            <div className="colon">:</div>
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

