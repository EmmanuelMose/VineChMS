import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-top">
          <div className="footer-brand">
            <span className="footer-logo">Vine<span>ChMS</span></span>
            <p className="footer-description">
              The comprehensive multi-tenant SaaS platform for church governance and management — serving churches, dioceses, and large organizations worldwide.
            </p>
          </div>

          <div className="footer-links">
            <div className="footer-column">
              <h4>Solutions</h4>
              <ul>
                <li><a href="#">Member Management</a></li>
                <li><a href="#">Giving & Finances</a></li>
                <li><a href="#">Event Management</a></li>
                <li><a href="#">Sermon Archives</a></li>
              </ul>
            </div>

            <div className="footer-column">
              <h4>Hierarchies</h4>
              <ul>
                <li><a href="#">Dioceses</a></li>
                <li><a href="#">Organizations</a></li>
                <li><a href="#">Churches</a></li>
                <li><a href="#">Members</a></li>
              </ul>
            </div>

            <div className="footer-column">
              <h4>Resources</h4>
              <ul>
                <li><a href="#">Documentation</a></li>
                <li><a href="#">API Reference</a></li>
                <li><a href="#">Support Center</a></li>
                <li><a href="#">Community</a></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="footer-contact">
            <span>hello@vinechms.com</span>
            <span className="footer-divider">|</span>
            <span>+1 (888) 555-CHMS</span>
            <span className="footer-divider">|</span>
            <span>Atlanta, GA</span>
          </div>
          <div className="footer-copy">
            &copy; 2026 VineChMS. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;