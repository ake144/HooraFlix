import { useState, useEffect, useRef } from 'react'
import { FiPlay, FiPause, FiVolume2, FiVolumeX, FiMaximize, FiSettings, FiMoreVertical } from 'react-icons/fi'
import { liveStreamsData } from '../data/liveStreamsData'
import './LiveStream.css'

const LiveStream = () => {
  const [selectedStream] = useState(liveStreamsData.find(s => s.category === 'music') || liveStreamsData[2])
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [volume, setVolume] = useState(100)
  const [showControls, setShowControls] = useState(true)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [youtubeReady, setYoutubeReady] = useState(false)
  const playerRef = useRef(null)
  const containerRef = useRef(null)

  // YouTube Live Music Concert Stream IDs (you can replace these with actual live stream IDs)
  // Using popular live music channels that often have live streams
  const youtubeLiveStreams = [
    'jfKfPfyJRdk', // Lofi Hip Hop Radio - Beats to Relax/Study To (popular 24/7 stream)
    '5qap5aO4i9A', // Chillhop Music - Lofi Hip Hop
    'DWcJFNfaw9c', // 24/7 lofi hip hop radio
  ]

  const currentStreamId = youtubeLiveStreams[0] // Use the first one, or make it dynamic

  useEffect(() => {
    // Wait for YouTube API to load
    const checkYouTubeAPI = setInterval(() => {
      if (window.YT && window.YT.Player) {
        setYoutubeReady(true)
        clearInterval(checkYouTubeAPI)
      }
    }, 100)

    return () => clearInterval(checkYouTubeAPI)
  }, [])

  useEffect(() => {
    if (youtubeReady && !playerRef.current) {
      playerRef.current = new window.YT.Player('youtube-player', {
        videoId: currentStreamId,
        playerVars: {
          autoplay: 0,
          controls: 0,
          disablekb: 1,
          enablejsapi: 1,
          fs: 0,
          iv_load_policy: 3,
          modestbranding: 1,
          playsinline: 1,
          rel: 0,
          showinfo: 0,
        },
        events: {
          onReady: (event) => {
            event.target.setVolume(volume)
            if (isMuted) {
              event.target.mute()
            }
          },
          onStateChange: (event) => {
            if (event.data === window.YT.PlayerState.PLAYING) {
              setIsPlaying(true)
            } else if (event.data === window.YT.PlayerState.PAUSED) {
              setIsPlaying(false)
            }
          },
        },
      })
    }

    return () => {
      if (playerRef.current) {
        playerRef.current.destroy()
        playerRef.current = null
      }
    }
  }, [youtubeReady, currentStreamId, volume, isMuted])

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowControls(false)
    }, 3000)
    return () => clearTimeout(timer)
  }, [showControls])

  const handleMouseMove = () => {
    setShowControls(true)
    const timer = setTimeout(() => {
      setShowControls(false)
    }, 3000)
    return () => clearTimeout(timer)
  }

  const togglePlay = () => {
    if (playerRef.current) {
      if (isPlaying) {
        playerRef.current.pauseVideo()
      } else {
        playerRef.current.playVideo()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const toggleMute = () => {
    if (playerRef.current) {
      if (isMuted) {
        playerRef.current.unMute()
        setIsMuted(false)
      } else {
        playerRef.current.mute()
        setIsMuted(true)
      }
    }
  }

  const handleVolumeChange = (e) => {
    const newVolume = parseInt(e.target.value)
    setVolume(newVolume)
    if (playerRef.current) {
      playerRef.current.setVolume(newVolume)
      if (newVolume === 0) {
        setIsMuted(true)
        playerRef.current.mute()
      } else if (isMuted && newVolume > 0) {
        setIsMuted(false)
        playerRef.current.unMute()
      }
    }
  }

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      if (containerRef.current?.requestFullscreen) {
        containerRef.current.requestFullscreen()
      } else if (containerRef.current?.webkitRequestFullscreen) {
        containerRef.current.webkitRequestFullscreen()
      } else if (containerRef.current?.msRequestFullscreen) {
        containerRef.current.msRequestFullscreen()
      }
      setIsFullscreen(true)
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen()
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen()
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen()
      }
      setIsFullscreen(false)
    }
  }

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }
    document.addEventListener('fullscreenchange', handleFullscreenChange)
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange)
    document.addEventListener('msfullscreenchange', handleFullscreenChange)
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange)
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange)
      document.removeEventListener('msfullscreenchange', handleFullscreenChange)
    }
  }, [])

  if (!selectedStream) return null

  return (
    <div 
      ref={containerRef}
      className="live-stream-page-fullscreen"
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setShowControls(false)}
    >
      <div className="video-container-fullscreen">
        <div className="youtube-player-container">
          <div id="youtube-player"></div>
        </div>

        {showControls && (
          <div className="video-controls-fullscreen">
            <div className="controls-top">
              <div className="stream-info-overlay">
                <div className="live-indicator-large">
                  <span className="live-dot-large"></span>
                  LIVE
                </div>
                <div className="stream-title-overlay">{selectedStream.title}</div>
                <div className="streamer-name-overlay">{selectedStream.streamer}</div>
                <div className="viewers-count-overlay">
                  <FiPlay /> {selectedStream.viewers.toLocaleString()} watching
                </div>
              </div>
            </div>

            <div className="controls-bottom">
              <div className="controls-left">
                <button className="control-btn" onClick={togglePlay}>
                  {isPlaying ? <FiPause /> : <FiPlay />}
                </button>
                <div className="volume-control">
                  <button className="control-btn" onClick={toggleMute}>
                    {isMuted || volume === 0 ? <FiVolumeX /> : <FiVolume2 />}
                  </button>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={volume}
                    onChange={handleVolumeChange}
                    className="volume-slider"
                  />
                </div>
              </div>

              <div className="controls-right">
                <button className="control-btn">
                  <FiSettings />
                </button>
                <button className="control-btn">
                  <FiMoreVertical />
                </button>
                <button className="control-btn" onClick={toggleFullscreen}>
                  <FiMaximize />
                </button>
              </div>
            </div>
          </div>
        )}

        {!showControls && (
          <div className="center-play-button">
            <button className="play-button-center" onClick={togglePlay}>
              {isPlaying ? <FiPause /> : <FiPlay />}
            </button>
          </div>
        )}
      </div>

      <div className="stream-chat-sidebar">
        <div className="chat-header">
          <h3>Live Chat</h3>
          <div className="live-badge-small">
            <span className="live-dot-small"></span>
            {selectedStream.viewers.toLocaleString()} watching
          </div>
        </div>
        <div className="chat-messages">
          <div className="chat-message">
            <span className="chat-username">User123:</span>
            <span className="chat-text">Amazing performance! 🎵</span>
          </div>
          <div className="chat-message">
            <span className="chat-username">MusicLover:</span>
            <span className="chat-text">This is incredible! 🔥</span>
          </div>
          <div className="chat-message">
            <span className="chat-username">ConcertFan:</span>
            <span className="chat-text">Best stream ever! ⭐</span>
          </div>
          <div className="chat-message">
            <span className="chat-username">LiveMusic:</span>
            <span className="chat-text">The sound quality is perfect! 🎧</span>
          </div>
          <div className="chat-message">
            <span className="chat-username">StreamWatcher:</span>
            <span className="chat-text">Can't stop listening! 🎶</span>
          </div>
        </div>
        <div className="chat-input-container">
          <input
            type="text"
            placeholder="Type a message..."
            className="chat-input"
          />
        </div>
      </div>
    </div>
  )
}

export default LiveStream
