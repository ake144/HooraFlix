import { useEffect, useMemo, useState } from 'react'
import './ComingSoon.css'

const ComingSoon = () => {
  // FIXED UNIVERSAL RELEASE TIME — all users count down to this same moment
  // Change this ISO string to your actual app release date/time
  const RELEASE_TIME = '2026-07-20T12:00:00Z'
  
  const targetDate = useMemo(() => {
    return new Date(RELEASE_TIME)
  }, [])

  // single source of truth: remaining seconds until target date
  const [remainingSeconds, setRemainingSeconds] = useState(() => {
    const diff = Math.ceil((targetDate.getTime() - Date.now()) / 1000)
    return Math.max(0, diff)
  })

  // update countdown every second — all devices see the same countdown
  useEffect(() => {
    const tick = () => {
      const diff = Math.ceil((targetDate.getTime() - Date.now()) / 1000)
      setRemainingSeconds(Math.max(0, diff))
    }

    tick()
    const timer = setInterval(tick, 1000)
    return () => clearInterval(timer)
  }, [targetDate])

  const formatTime = (value) => value.toString().padStart(2, '0')

  // derive days/hours/minutes/seconds from remainingSeconds
  const days = Math.floor(remainingSeconds / (24 * 3600))
  const hours = Math.floor((remainingSeconds % (24 * 3600)) / 3600)
  const minutes = Math.floor((remainingSeconds % 3600) / 60)
  const seconds = remainingSeconds % 60

  return (
    <div className="coming-soon-section">
      <div className="coming-soon-background"></div>
      
      <div className="coming-soon-content">
        <div className="timer-strip" aria-label="Launch countdown">
          <div className="timer-cell">
            <div className="timer-value">{formatTime(days)}</div>
            <div className="timer-label">DAYS</div>
          </div>

          <div className="timer-separator" aria-hidden="true">:</div>

          <div className="timer-cell">
            <div className="timer-value">{formatTime(hours)}</div>
            <div className="timer-label">HOURS</div>
          </div>

          <div className="timer-separator" aria-hidden="true">:</div>

          <div className="timer-cell">
            <div className="timer-value">{formatTime(minutes)}</div>
            <div className="timer-label">MINUTES</div>
          </div>

          <div className="timer-separator" aria-hidden="true">:</div>

          <div className="timer-cell">
            <div className="timer-value">{formatTime(seconds)}</div>
            <div className="timer-label">SECONDS</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ComingSoon

