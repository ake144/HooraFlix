import './PopularShowsSidebar.css'

const PopularShowsSidebar = ({ shows }) => {
  if (!shows || shows.length === 0) return null

  return (
    <div className="popular-shows-sidebar">
      <h3 className="sidebar-title">Popular TV Shows</h3>
      <div className="popular-shows-list">
        {shows.map((show, index) => (
          <div key={show.id} className="popular-show-item">
            <span className="popular-show-number">{index + 1}</span>
            <div className="popular-show-thumbnail">
              <img src={show.thumbnail} alt={show.title} />
            </div>
            <div className="popular-show-info">
              <div className="popular-show-year">{show.year}</div>
              <h4 className="popular-show-title">{show.title}</h4>
              <p className="popular-show-genre">{show.genre}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default PopularShowsSidebar

