import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { FiSearch, FiBell, FiLogOut, FiUser } from 'react-icons/fi'
import { useAuth } from '../context/AuthContext'
import './Header.css'

const Header = () => {
  const location = useLocation()
  const { user } = useAuth() || {}
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
            <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}>Live Stream</Link>
            <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}>Movies</Link>
            <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}>New & Popular</Link>
            <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}>My List</Link>
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
              className='join-cta'
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              style={{ display: 'flex', alignItems: 'center', gap: '8px', paddingRight: '10px', width: 'auto' }}
            >
             Join Funders  
            </div>
            
            {showProfileMenu && (
              <div className="profile-dropdown">
                <Link to="/founders" className="dropdown-item">
                  <FiUser className="dropdown-icon" />
                  <span>Founders Area</span>
                </Link>
                <Link to="/login" className="dropdown-item">
                  <FiLogOut className="dropdown-icon" />
                  <span>LogIn</span>
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


