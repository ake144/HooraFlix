import { FiFacebook, FiTwitter, FiInstagram, FiYoutube } from 'react-icons/fi'
import './Footer.css'

const Footer = () => (
  <footer className="footer">
    <div className="footer-container">
      <div className="footer-branding">
        <p className="brand-title">HOORAFLIX</p>
        <p className="brand-note">African storytelling, curated for tonight’s stream.</p>
      </div>

      <div className="footer-columns">
        <div className="footer-column">
          <h5>Series</h5>
          <a href="#">Our slate</a>
          <a href="#">Coming soon</a>
        </div>
        <div className="footer-column">
          <h5>Support</h5>
          <a href="#">FAQ</a>
          <a href="#">Help center</a>
        </div>
        <div className="footer-column">
          <h5>Build</h5>
          <a href="#">Founders</a>
          <a href="#">Academy</a>
        </div>
      </div>

      <div className="footer-end">
        <span>© 2026 HooraFlix</span>
        <div className="footer-social">
          <a href="#" aria-label="Facebook"><FiFacebook /></a>
          <a href="#" aria-label="Twitter"><FiTwitter /></a>
          <a href="#" aria-label="Instagram"><FiInstagram /></a>
          <a href="#" aria-label="YouTube"><FiYoutube /></a>
        </div>
      </div>
    </div>
  </footer>
)

export default Footer

