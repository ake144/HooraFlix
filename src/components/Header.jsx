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
            <Link to="/academy" className={`nav-link ${location.pathname === '/academy' ? 'active' : ''}`}>Academy</Link>
            <Link to="/casting" className={`nav-link ${location.pathname === '/casting' ? 'active' : ''}`}>Casting</Link>
            <Link to="/opportunity" className={`nav-link ${location.pathname === '/opportunity' ? 'active' : ''}`}>Opportunity</Link>
            <Link to="/revenue" className={`nav-link ${location.pathname === '/revenue' ? 'active' : ''}`}>Revenue</Link>
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
              style={{ display: 'flex', alignItems: 'center', gap: '8px', paddingRight: '10px', width: 'auto' }}
            >
              <span>{user?.name?.[0] || 'U'}</span>
              {user && (
                  <span className="user-role-badge" style={{ fontSize: '0.7rem', backgroundColor: '#e50914', padding: '2px 6px', borderRadius: '4px', marginLeft: '5px' }}>
                    {user.role}
                  </span>
              )}
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


