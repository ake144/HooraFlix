import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { FiSearch, FiBell, FiLogOut, FiUser, FiLogIn } from 'react-icons/fi'
import { useAuth } from '../context/AuthContext'
import './Header.css'

const Header = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout, isAuthenticated } = useAuth() || {}
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

  const handleLogout = async () => {
    await logout();
    navigate('/login');
    setShowProfileMenu(false);
  };

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
             {user?.isFounder ? 'Founder Circle' : isAuthenticated ? 'My Account' : 'Join Funders'}
            </div>
            
            {showProfileMenu && (
              <div className="profile-dropdown">
                {isAuthenticated ? (
                  <>
                     <Link to="/founders" className="dropdown-item" onClick={() => setShowProfileMenu(false)}>
                      <FiUser className="dropdown-icon" />
                      <span>Founders Area</span>
                    </Link>
                    {user?.isFounder && (
                        <Link to="/founders-dashboard" className="dropdown-item" onClick={() => setShowProfileMenu(false)}>
                        <FiUser className="dropdown-icon" />
                        <span>Dashboard</span>
                        </Link>
                    )}
                    <button onClick={handleLogout} className="dropdown-item" style={{background: 'none', border: 'none', width: '100%', textAlign: 'left', cursor: 'pointer'}}>
                      <FiLogOut className="dropdown-icon" />
                      <span>Log Out</span>
                    </button>
                  </>
                ) : (
                  <>
                     <Link to="/founders" className="dropdown-item" onClick={() => setShowProfileMenu(false)}>
                      <FiUser className="dropdown-icon" />
                      <span>Founders Area</span>
                    </Link>
                    <Link to="/login" className="dropdown-item" onClick={() => setShowProfileMenu(false)}>
                      <FiLogIn className="dropdown-icon" />
                      <span>Log In</span>
                    </Link>
                    <Link to="/signup" className="dropdown-item" onClick={() => setShowProfileMenu(false)}>
                      <FiUser className="dropdown-icon" />
                      <span>Sign Up</span>
                    </Link>
                  </>
                )}
              </div>
            )}
          </div>

        </div>
      </div>
    </header>
  )
}

export default Header


