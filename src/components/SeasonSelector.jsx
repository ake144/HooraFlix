import './SeasonSelector.css'

const SeasonSelector = ({ seasons, selectedSeason, onSeasonChange }) => {
  return (
    <div className="season-selector">
      <div className="season-label">Episodes 1-{seasons.find(s => s.seasonNumber === selectedSeason)?.episodes.length || 0}</div>
      <div className="season-tabs">
        {seasons.map((season) => (
          <button
            key={season.seasonNumber}
            className={`season-tab ${selectedSeason === season.seasonNumber ? 'active' : ''}`}
            onClick={() => onSeasonChange(season.seasonNumber)}
          >
            Season {season.seasonNumber}
          </button>
        ))}
      </div>
    </div>
  )
}

export default SeasonSelector

