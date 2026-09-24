import { useEffect, useState } from 'react'
import './ComingSoon.css'

const RELEASE_TIME = '2026-11-20T12:00:00Z'

const ComingSoon = () => {
  const calculateRemaining = () => {
    const targetTime = new Date(RELEASE_TIME).getTime()
    const currentTime = Date.now()
    const difference = targetTime - currentTime

    return Math.max(0, Math.ceil(difference / 1000))
  }

  const [remainingSeconds, setRemainingSeconds] = useState(
    calculateRemaining()
  )

  useEffect(() => {
    const tick = () => {
      setRemainingSeconds(calculateRemaining())
    }

    tick()

    const timer = window.setInterval(tick, 1000)

    return () => {
      window.clearInterval(timer)
    }
  }, [])

  const days = Math.floor(
    remainingSeconds / (24 * 60 * 60)
  )

  const hours = Math.floor(
    (remainingSeconds % (24 * 60 * 60)) / (60 * 60)
  )

  const minutes = Math.floor(
    (remainingSeconds % (60 * 60)) / 60
  )

  const seconds = remainingSeconds % 60

  const formatTime = (value) => {
    return String(value).padStart(2, '0')
  }

  return (
    <div className="coming-soon-section">
      <div className="coming-soon-background"></div>

      <div className="coming-soon-content">
        <div
          className="timer-strip"
          aria-label="Launch countdown"
        >
          <div className="timer-cell">
            <div className="timer-value">
              {formatTime(days)}
            </div>
            <div className="timer-label">
              DAYS
            </div>
          </div>

          <div
            className="timer-separator"
            aria-hidden="true"
          >
            :
          </div>

          <div className="timer-cell">
            <div className="timer-value">
              {formatTime(hours)}
            </div>
            <div className="timer-label">
              HOURS
            </div>
          </div>

          <div
            className="timer-separator"
            aria-hidden="true"
          >
            :
          </div>

          <div className="timer-cell">
            <div className="timer-value">
              {formatTime(minutes)}
            </div>
            <div className="timer-label">
              MINUTES
            </div>
          </div>

          <div
            className="timer-separator"
            aria-hidden="true"
          >
            :
          </div>

          <div className="timer-cell">
            <div className="timer-value">
              {formatTime(seconds)}
            </div>
            <div className="timer-label">
              SECONDS
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ComingSoon
