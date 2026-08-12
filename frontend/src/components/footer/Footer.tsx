import {
  MdChurch,
  MdEmail,
  MdPhone,
  MdLocationPin,
  MdChevronRight,
  MdSend,
} from "react-icons/md";
import {
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaYoutube,
} from "react-icons/fa";
import OpenBible from "../../assets/images/OpenBible.jpeg";
import "./Footer.css";

const SOLUTIONS: string[] = [
  "Member Management",
  "Giving & Finance",
  "Event Scheduling",
];

const HIERARCHIES: string[] = [
  "Diocese / Synod",
  "Regional Admin",
  "Local Church",
];

const RESOURCES: string[] = [
  "Documentation",
  "Support Center",
  "Community",
];

const SOCIAL_LINKS = [
  { icon: FaFacebook, href: "#" },
  { icon: FaTwitter, href: "#" },
  { icon: FaInstagram, href: "#" },
  { icon: FaYoutube, href: "#" },
];

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-top">
          <div className="footer-brand">
            <a href="#" className="footer-logo-link">
              <div className="footer-logo-icon">
                <MdChurch className="footer-logo-svg" />
              </div>
              <span className="footer-logo-text">
                Vine<span className="footer-logo-highlight">ChMS</span>
              </span>
            </a>
            <p className="footer-description">
              The all-in-one church management platform serving dioceses,
              regional administrations, and local congregations worldwide.
            </p>
            <div className="footer-contact">
              <a href="mailto:hello@vinechms.com" className="footer-contact-link">
                <MdEmail className="footer-contact-icon" />
                hello@vinechms.com
              </a>
              <a href="tel:+1888555CHMS" className="footer-contact-link">
                <MdPhone className="footer-contact-icon" />
                +1 (888) 555-CHMS
              </a>
              <span className="footer-contact-link">
                <MdLocationPin className="footer-contact-icon" />
                Atlanta, GA
              </span>
            </div>
            <div className="footer-subscribe">
              <p className="footer-subscribe-text">Subscribe for updates</p>
              <form className="footer-subscribe-form" onSubmit={(e) => e.preventDefault()}>
                <input
                  type="email"
                  placeholder="Your email"
                  className="footer-subscribe-input"
                  required
                />
                <button type="submit" className="footer-subscribe-btn">
                  <MdSend className="footer-subscribe-btn-icon" />
                </button>
              </form>
            </div>
          </div>

          <div className="footer-links">
            <div className="footer-column">
              <h4 className="footer-column-title">Solutions</h4>
              <ul className="footer-column-list">
                {SOLUTIONS.map((s) => (
                  <li key={s}>
                    <a href="#" className="footer-column-link">
                      <MdChevronRight className="footer-column-link-icon" />
                      {s}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="footer-column">
              <h4 className="footer-column-title">Hierarchies</h4>
              <ul className="footer-column-list">
                {HIERARCHIES.map((h) => (
                  <li key={h}>
                    <a href="#hierarchy" className="footer-column-link">
                      <MdChevronRight className="footer-column-link-icon" />
                      {h}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="footer-column">
              <h4 className="footer-column-title">Resources</h4>
              <ul className="footer-column-list">
                {RESOURCES.map((r) => (
                  <li key={r}>
                    <a href="#" className="footer-column-link">
                      <MdChevronRight className="footer-column-link-icon" />
                      {r}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="footer-divider" />

        <div className="footer-bottom-row">
          <div className="footer-bottom-left">
            <div className="footer-bottom">
              <p className="footer-copyright">
                &copy; {new Date().getFullYear()} VineChMS. All rights reserved.
              </p>
              <div className="footer-social">
                {SOCIAL_LINKS.map((social, index) => {
                  const Icon = social.icon;
                  return (
                    <a key={index} href={social.href} className="footer-social-link">
                      <Icon className="footer-social-icon" />
                    </a>
                  );
                })}
              </div>
              <div className="footer-legal">
                <a href="#" className="footer-legal-link">Privacy</a>
                <a href="#" className="footer-legal-link">Terms</a>
                <a href="#" className="footer-legal-link">Cookies</a>
              </div>
            </div>
          </div>
          <div className="footer-bottom-right">
            <img src={OpenBible} alt="Open Bible" className="footer-bible-image" />
          </div>
        </div>
      </div>
    </footer>
  );
}