import { Shield, Check, Mail, Phone, MapPin, Send } from "lucide-react";
import "./CTA.css";

export default function CTA() {
  return (
    <section className="cta" id="contact">
      <div className="cta-container">
        <div className="cta-grid">
          {/* Left Column - Header & Info */}
          <div className="cta-header">
            <span className="cta-tag">Get in Touch</span>
            <h2 className="cta-title">
              Ready to Transform Your
              <br />
              <span className="cta-title-highlight">Church Management?</span>
            </h2>
            <p className="cta-subtitle">
              Join 340+ churches already using VineChMS to streamline operations,
              engage members, and grow their community.
            </p>

            <div className="cta-contact-info">
              <div className="cta-contact-item">
                <Mail className="cta-contact-icon" />
                <span>hello@vinechms.com</span>
              </div>
              <div className="cta-contact-item">
                <Phone className="cta-contact-icon" />
                <span>+1 (888) 555-CHMS</span>
              </div>
              <div className="cta-contact-item">
                <MapPin className="cta-contact-icon" />
                <span>Atlanta, GA</span>
              </div>
            </div>

            <div className="cta-trust-badges">
              <span className="cta-badge">
                <Shield className="cta-badge-icon" />
                SOC 2 Compliant
              </span>
              <span className="cta-badge">
                <Check className="cta-badge-icon" />
                No credit card required
              </span>
              <span className="cta-badge">
                <Check className="cta-badge-icon" />
                14-day free trial
              </span>
            </div>
          </div>

          {/* Right Column - Contact Form */}
          <div className="cta-form-wrapper">
            <form className="cta-form" onSubmit={(e) => e.preventDefault()}>
              <div className="cta-form-group">
                <label htmlFor="name">Full Name</label>
                <input type="text" id="name" placeholder="John Doe" required />
              </div>
              <div className="cta-form-group">
                <label htmlFor="email">Email Address</label>
                <input type="email" id="email" placeholder="john@church.com" required />
              </div>
              <div className="cta-form-group">
                <label htmlFor="message">Message</label>
                <textarea
                  id="message"
                  rows={4}
                  placeholder="Tell us about your church and what you need..."
                  required
                ></textarea>
              </div>
              <button type="submit" className="cta-button">
                Send Message
                <Send className="cta-button-icon" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}