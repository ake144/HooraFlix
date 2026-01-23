import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { FiSearch, FiBell, FiLogOut, FiUser } from 'react-icons/fi'
import './dashboard.css'
import { useAuth } from '../../context/AuthContext'

const DashboardHeader = () => {
  const location = useLocation()
  const [isScrolled, setIsScrolled] = useState(false)
  const {user} = useAuth() as any;
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
            <Link to="/academy" className={`nav-link ${location.pathname === '/academy' ? 'active' : ''}`}>Academy </Link>
            <Link to="/casting" className={`nav-link ${location.pathname === '/casting' ? 'active' : ''}`}>Casting</Link>
            <Link to="/opportunity" className={`nav-link ${location.pathname === '/opportunity' ? 'active' : ''}`}>Opportunity</Link>
            <Link to="/revenue" className={`nav-link ${location.pathname === '/revenue' ? 'active' : ''}`}>Revenue</Link>
          </nav>
        </div>
        <div className="header-right">
           <div className=''>
                {user?.role && (
                  <span className='user-role-badge'>{user?.role || 'User'}</span>
                )}
           </div>
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

export default DashboardHeader;


