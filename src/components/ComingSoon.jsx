import { useEffect, useMemo, useState } from 'react'
import './ComingSoon.css'

const ComingSoon = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })

 
  const targetDate = useMemo(() => {
    const date = new Date()
    date.setDate(date.getDate() + 60)
    return date
  }, [])

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime()
      const difference = targetDate.getTime() - now

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24))
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
        const seconds = Math.floor((difference % (1000 * 60)) / 1000)

        setTimeLeft({ days, hours, minutes, seconds })
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 })
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
        <div className="timer-strip" aria-label="Launch countdown">
          <div className="timer-cell">
            <div className="timer-value">{formatTime(timeLeft.days)}</div>
            <div className="timer-label">DAYS</div>
          </div>

          <div className="timer-separator" aria-hidden="true">:</div>

          <div className="timer-cell">
            <div className="timer-value">{formatTime(timeLeft.hours)}</div>
            <div className="timer-label">HOURS</div>
          </div>

          <div className="timer-separator" aria-hidden="true">:</div>

          <div className="timer-cell">
            <div className="timer-value">{formatTime(timeLeft.minutes)}</div>
            <div className="timer-label">MINUTES</div>
          </div>

          <div className="timer-separator" aria-hidden="true">:</div>

          <div className="timer-cell">
            <div className="timer-value">{formatTime(timeLeft.seconds)}</div>
            <div className="timer-label">SECONDS</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ComingSoon

