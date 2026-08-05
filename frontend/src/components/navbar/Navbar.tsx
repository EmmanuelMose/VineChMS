import { useState } from 'react';
import './Navbar.css';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-logo">
          <span className="logo-text">Vine<span className="logo-highlight">ChMS</span></span>
        </div>

        <div className={`navbar-menu ${isOpen ? 'active' : ''}`}>
          <ul className="navbar-links">
            <li><a href="#features" className="nav-link" onClick={closeMenu}>Features</a></li>
            <li><a href="#services" className="nav-link" onClick={closeMenu}>Services</a></li>
            <li><a href="#hierarchy" className="nav-link" onClick={closeMenu}>Hierarchy</a></li>
            <li><a href="#contact" className="nav-link" onClick={closeMenu}>Contact</a></li>
          </ul>
          <button className="btn-get-started" onClick={closeMenu}>Get Started</button>
        </div>

        <div className="navbar-toggle" onClick={toggleMenu}>
          <span className={`hamburger ${isOpen ? 'active' : ''}`}></span>
          <span className={`hamburger ${isOpen ? 'active' : ''}`}></span>
          <span className={`hamburger ${isOpen ? 'active' : ''}`}></span>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;