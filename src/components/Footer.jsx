import React from 'react';
import { FaFacebookF, FaTwitter, FaInstagram, FaYoutube, FaLinkedinIn } from 'react-icons/fa';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Top Header Section */}
        <div className="footer-header">
            <h2 className="footer-brand">HOORAFLIX</h2>
            <p className="footer-tagline">Innovating Content, Empowering Creators</p>
        </div>

        <div className="footer-main-content">
            {/* Column 1: About, Founder & Investors */}
            <div className="footer-column about-column">
                <div className="footer-section">
                    <h3>About Us</h3>
                    <p>
                        Hoorafilx is dedicated to providing creative solutions that empower content creators, 
                        businesses, and educational platforms across Ethiopia and beyond. 
                        Join us in shaping the future of media.
                    </p>
                </div>
                
                <div className="footer-section">
                    <h3>Founder</h3>
                    <h4>Henok Tesfaye</h4>
                    <p>
                        The visionary founder of Hoorafilx, Henok has a passion for storytelling and innovation. 
                        Under his leadership, Hoorafilx has become a platform for empowering creators and redefining media in Ethiopia.
                    </p>
                </div>

                <div className="footer-section">
                     <h3>Investors</h3>
                     <p>
                        We are proudly backed by visionary investors who share our commitment to creativity and growth. 
                        Their support enables Hoorafilx to bring unique content, technology, and opportunities to creators across the globe.
                     </p>
                     <ul className="investor-list">
                        {/* <li>Investor 1 will be named</li>
                        <li>Investor 2 will be named</li>
                        <li>Investor 3 will be named</li> */}
                     </ul>
                </div>
            </div>

            {/* Column 2: Quick Links */}
            <div className="footer-column links-column">
                <h3>Quick Links</h3>
                <ul className="footer-nav">
                    <li><a href="/">Home</a></li>
                    <li><a href="/about">About Us</a></li>
                    <li><a href="/academy">Academy</a></li>
                    <li><a href="/investor">Investor</a></li>
                    <li><a href="/affiliate">Affiliate founder</a></li>
                    <li><a href="/blog">Blog</a></li>
                    <li><a href="/contact">Contact</a></li>
                    <li><a href="/careers">Careers</a></li>
                    <li><a href="/privacy">Privacy Policy</a></li>
                    <li><a href="/terms">Terms & Conditions</a></li>
                </ul>
            </div>

            {/* Column 3: Contact, Newsletter & Social */}
            <div className="footer-column contact-column">
                <div className="footer-section">
                    <h3>Contact Us</h3>
                    <ul className="contact-list">
                        <li><span>📍</span> Addis Ababa, Ethiopia</li>
                        <li><span>📞</span> +251 902357777</li>
                        <li><a href="mailto:contact@hoorafilx.com"><span>📧</span> contact@hoorafilx.com</a></li>
                        <li><a href="mailto:info@hoorafilx.com"><span>📧</span> info@hoorafilx.com</a></li>
                    </ul>
                </div>

                <div className="footer-section newsletter-section">
                    <h3>Subscribe to Our Newsletter</h3>
                    <p>Stay updated with the latest news and content from Hoorafilx.</p>
                    <form className="newsletter-form" onSubmit={(e) => e.preventDefault()}>
                        <input type="email" placeholder="Enter your email" required />
                        <button type="submit">Sign Up</button>
                    </form>
                </div>

                <div className="footer-section social-section">
                    <h3>Follow Us</h3>
                    <div className="social-icons">
                        <a href="https://facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook"><FaFacebookF /></a>
                        <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram"><FaInstagram /></a>
                        <a href="https://twitter.com" target="_blank" rel="noreferrer" aria-label="Twitter"><FaTwitter /></a>
                        <a href="https://youtube.com" target="_blank" rel="noreferrer" aria-label="YouTube"><FaYoutube /></a>
                        <a href="https://linkedin.com" target="_blank" rel="noreferrer" aria-label="LinkedIn"><FaLinkedinIn /></a>
                    </div>
                </div>
            </div>
        </div>

        <div className="footer-bottom">
            <p>&copy; 2026 Hoorafilx. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
