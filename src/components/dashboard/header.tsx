import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
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
  const {logout} = useAuth()  as any;
  const  navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleLogOut = () => {
    logout();
    navigate('/login');
    
  }

  return (
    <header className={`header ${isScrolled ? 'scrolled' : ''}`}>
      <div className="header-content">
        <div className="header-left">
          <Link to="/founders" className="logo">
            <span className="logo-text">HOORAFLIX</span>
          </Link>
          <nav className="nav-links">
            <Link to="/founders" className={`nav-link ${location.pathname === '/founders' ? 'active' : ''}`}>Home</Link>
            <Link to="/academy" className={`nav-link ${location.pathname === '/academy' ? 'active' : ''}`}>Academy </Link>
            <Link to="/casting" className={`nav-link ${location.pathname === '/casting' ? 'active' : ''}`}>Casting</Link>
            <Link to="/opportunity" className={`nav-link ${location.pathname === '/opportunity' ? 'active' : ''}`}>Opportunity</Link>
            <Link to="/revenue" className={`nav-link ${location.pathname === '/revenue' ? 'active' : ''}`}>Revenue</Link>
          </nav>
        </div>
        <div className="header-right">
          <div className="status-block">
            <div className="status-dot" />
            <div>
              <div className="status-label">Current status</div>
              <div className="status-value">{user?.role || 'User'}</div>
            </div>
          </div>
          <button className="icon-button" aria-label="Notifications">
            <FiBell />
          </button>
          <div className="profile-menu-container">
            <button className="profile-avatar" onClick={() => setShowProfileMenu(!showProfileMenu)}>
              <span>{(user?.name?.[0] || user?.email?.[0] || 'U').toUpperCase()}</span>
            </button>
            {showProfileMenu && (
              <div className="profile-dropdown">
                <div className="dropdown-item">
                  <FiUser className="dropdown-icon" />
                  <div>
                    <strong>{user?.name || 'Guest Member'}</strong>
                    <div className="email-caption">{user?.email || 'Not signed in'}</div>
                  </div>
                </div>
                <Link to="/founders" className="dropdown-item">
                  <span>Member area</span>
                </Link>
                <button onClick={()=>handleLogOut()} className="dropdown-item logout">
                  <FiLogOut className="dropdown-icon" />
                  <span style={{color:'black'}}>Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

export default DashboardHeader;


