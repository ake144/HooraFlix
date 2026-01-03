import { FiFacebook, FiTwitter, FiInstagram, FiYoutube } from 'react-icons/fi'
import './Footer.css'

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-section">
            <h4 className="footer-heading">Questions? Contact us.</h4>
          </div>
          
          <div className="footer-links">
            <div className="footer-column">
              <a href="#" className="footer-link">FAQ</a>
              <a href="#" className="footer-link">Investor Relations</a>
              <a href="#" className="footer-link">Privacy</a>
              <a href="#" className="footer-link">Speed Test</a>
            </div>
            
            <div className="footer-column">
              <a href="#" className="footer-link">Help Center</a>
              <a href="#" className="footer-link">Jobs</a>
              <a href="#" className="footer-link">Cookie Preferences</a>
              <a href="#" className="footer-link">Legal Notices</a>
            </div>
            
            <div className="footer-column">
              <a href="#" className="footer-link">Account</a>
              <a href="#" className="footer-link">Ways to Watch</a>
              <a href="#" className="footer-link">Corporate Information</a>
              <a href="#" className="footer-link">Only on HooraFlix</a>
            </div>
            
            <div className="footer-column">
              <a href="#" className="footer-link">Media Center</a>
              <a href="#" className="footer-link">Terms of Use</a>
              <a href="#" className="footer-link">Contact Us</a>
            </div>
          </div>
          
          <div className="footer-language">
            <select className="language-select">
              <option value="en">English</option>
              <option value="es">Español</option>
              <option value="fr">Français</option>
              <option value="de">Deutsch</option>
            </select>
          </div>
          
          <div className="footer-social">
            <a href="#" className="social-link" aria-label="Facebook">
              <FiFacebook />
            </a>
            <a href="#" className="social-link" aria-label="Twitter">
              <FiTwitter />
            </a>
            <a href="#" className="social-link" aria-label="Instagram">
              <FiInstagram />
            </a>
            <a href="#" className="social-link" aria-label="YouTube">
              <FiYoutube />
            </a>
          </div>
          
          <div className="footer-copyright">
            <p>© 2025 HooraFlix, Inc.</p>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer

