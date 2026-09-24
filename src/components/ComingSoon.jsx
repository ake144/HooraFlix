import { useEffect, useState } from 'react'
import './ComingSoon.css'

const RELEASE_TIME = '2026-11-20T12:00:00Z'

const ComingSoon = () => {
  const [remainingSeconds, setRemainingSeconds] = useState(null)
  const [debug, setDebug] = useState(null)

  useEffect(() => {
    const calculateCountdown = () => {
      const target = new Date(RELEASE_TIME)
      const targetTimestamp = target.getTime()
      const currentTimestamp = Date.now()

      const difference = targetTimestamp - currentTimestamp
      const seconds = Math.max(0, Math.ceil(difference / 1000))

      console.log('========== COUNTDOWN DEBUG ==========')
      console.log('Release string:', RELEASE_TIME)
      console.log('Target date:', target)
      console.log('Target timestamp:', targetTimestamp)
      console.log('Current date:', new Date())
      console.log('Current timestamp:', currentTimestamp)
      console.log('Difference ms:', difference)
      console.log('Difference seconds:', difference / 1000)
      console.log('Remaining seconds:', seconds)
      console.log('=====================================')

      setRemainingSeconds(seconds)

      setDebug({
        target: target.toString(),
        targetTimestamp,
        current: new Date().toString(),
        currentTimestamp,
        difference,
        differenceSeconds: difference / 1000,
      })
    }

    calculateCountdown()

    const timer = window.setInterval(
      calculateCountdown,
      1000
    )

    return () => {
      window.clearInterval(timer)
    }
  }, [])

  if (remainingSeconds === null) {
    return null
  }

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

  const formatTime = (value) =>
    String(value).padStart(2, '0')

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

          <div className="timer-separator">
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

          <div className="timer-separator">
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

          <div className="timer-separator">
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

        {/* TEMPORARY DEBUG INFORMATION */}
        <div
          style={{
            marginTop: '30px',
            padding: '20px',
            background: '#000',
            color: '#fff',
            fontSize: '12px',
            lineHeight: '1.6',
            textAlign: 'left',
            maxWidth: '700px',
            overflow: 'auto',
          }}
        >
          <div>
            <strong>RELEASE:</strong>{' '}
            {RELEASE_TIME}
          </div>

          <div>
            <strong>Remaining seconds:</strong>{' '}
            {remainingSeconds}
          </div>

          {debug && (
            <>
              <div>
                <strong>Target:</strong>{' '}
                {debug.target}
              </div>

              <div>
                <strong>Target timestamp:</strong>{' '}
                {debug.targetTimestamp}
              </div>

              <div>
                <strong>Current:</strong>{' '}
                {debug.current}
              </div>

              <div>
                <strong>Current timestamp:</strong>{' '}
                {debug.currentTimestamp}
              </div>

              <div>
                <strong>Difference:</strong>{' '}
                {debug.difference}
              </div>

              <div>
                <strong>Difference seconds:</strong>{' '}
                {debug.differenceSeconds}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default ComingSoon
