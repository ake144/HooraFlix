import { FiClock } from 'react-icons/fi'
import './EpisodeList.css'

const EpisodeList = ({ episodes, selectedEpisode, onEpisodeSelect, seasonNumber }) => {
  if (!episodes || episodes.length === 0) {
    return (
      <div className="episode-list-empty">
        <p>No episodes available for this season.</p>
      </div>
    )
  }

  return (
    <div className="episode-list">
      {episodes.map((episode) => (
        <div
          key={episode.id}
          className={`episode-item ${selectedEpisode === episode.episodeNumber ? 'active' : ''}`}
          onClick={() => onEpisodeSelect(episode.episodeNumber)}
        >
          <div className="episode-number">{episode.episodeNumber}</div>
          <div className="episode-info">
            <div className="episode-header-info">
              <span className="episode-time">
                <FiClock /> {episode.duration}
              </span>
              <span className="episode-code">S{seasonNumber.toString().padStart(2, '0')}E{episode.episodeNumber.toString().padStart(2, '0')}</span>
              <span className="episode-name-inline">{episode.title}</span>
            </div>
            {episode.description && (
              <p className="episode-desc">{episode.description}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

export default EpisodeList

