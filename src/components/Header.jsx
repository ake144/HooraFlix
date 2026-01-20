import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { FiSearch, FiBell, FiLogOut, FiUser } from 'react-icons/fi'
import './Header.css'

const Header = () => {
  const location = useLocation()
  const [isScrolled, setIsScrolled] = useState(false)
  const [showSearch, setShowSearch] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [showProfileMenu, setShowProfileMenu] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header className={`header ${isScrolled ? 'scrolled' : ''}`}>
      <div className="header-content">
        <div className="header-left">
          <Link to="/" className="logo">
            <span className="logo-text">HOORAFLIX</span>
          </Link>
          <nav className="nav-links">
            <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}>Home</Link>
            <Link to="/live-stream" className={`nav-link ${location.pathname === '/live-stream' ? 'active' : ''}`}>Live Stream</Link>
            <Link to="/movies" className={`nav-link ${location.pathname === '/movies' ? 'active' : ''}`}>Movies</Link>
            <Link to="/" className="nav-link">New & Popular</Link>
            <Link to="/" className="nav-link">My List</Link>
          </nav>
        </div>
        <div className="header-right">
          <div className={`search-container ${showSearch ? 'active' : ''}`}>
            <input
              type="text"
              placeholder="Search..."
              className="search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button 
            className="icon-button"
            onClick={() => setShowSearch(!showSearch)}
            aria-label="Search"
          >
            <FiSearch />
          </button>
          <button className="icon-button" aria-label="Notifications">
            <FiBell />
          </button>
          
          <div className="profile-menu-container">
            <div 
              className="profile-avatar" 
              onClick={() => setShowProfileMenu(!showProfileMenu)}
            >
              <span>U</span>
            </div>
            
            {showProfileMenu && (
              <div className="profile-dropdown">
                <Link to="/founders" className="dropdown-item">
                  <FiUser className="dropdown-icon" />
                  <span>Founders Area</span>
                </Link>
                <Link to="/login" className="dropdown-item">
                  <FiLogOut className="dropdown-icon" />
                  <span>Logout</span>
                </Link>
              </div>
            )}
          </div>

        </div>
      </div>
    </header>
  )
}

export default Header


