import { Link } from 'react-router-dom'
import { FiGrid, FiHome, FiMonitor, FiSearch, FiUser } from 'react-icons/fi'
import './LandingHeader.css'

const LandingHeader = () => (
  <>
    <header className="landing-header">
      <Link className="landing-brand" to="/">HOORAFLIX</Link>
      <nav className="landing-nav" aria-label="Primary navigation">
        <Link className="is-active" to="/">Home</Link><Link to="/live-stream">Live Stream</Link><Link to="/movies">Movies⌄</Link><a href="#upcoming">New &amp; Popular</a><a href="#my-list">My List</a>
      </nav>
      <div className="landing-actions">
        <label className="landing-search"><FiSearch /><input aria-label="Search films" placeholder="Please enter keywords" /></label>
        <div className="landing-languages"><b>EN</b><span>አማ</span><span>FR</span></div>
        <Link className="landing-founders" to="/founders">Join Funders</Link>
        <Link className="landing-signin" to="/login">Sign In</Link>
      </div>
    </header>
    <nav className="landing-bottom-nav" aria-label="Mobile navigation">
      <Link className="is-active" to="/"><FiHome /><span>Home</span></Link><Link to="/movies"><FiGrid /><span>Movies</span></Link><Link to="/live-stream"><FiMonitor /><span>TV Shows</span></Link><a href="#upcoming"><FiSearch /><span>Search</span></a><Link to="/login"><FiUser /><span>Account</span></Link>
    </nav>
  </>
)

export default LandingHeader
