import { ArrowRight, Shield, Check, Sparkles } from "lucide-react";
import "./CTA.css";

export default function CTA() {
  return (
    <section className="cta" id="contact">
      <div className="cta-gradient" />
      <div className="cta-blob top-right" />
      <div className="cta-blob bottom-left" />

      <div className="cta-container">
        <div className="cta-badge animate-cta">
          <Sparkles className="cta-badge-icon" />
          <span>Start your 14-day free trial</span>
        </div>

        <h2 className="cta-title">
          Ready to Transform Your
          <br />
          <span className="cta-title-highlight">Church Management?</span>
        </h2>
        <p className="cta-subtitle">
          Join 340+ churches already using VineChMS to streamline operations,
          engage members, and grow their community.
        </p>

        <div className="cta-form">
          <input type="email" placeholder="Enter your email" className="cta-input" />
          <button className="cta-button">
            Start Free Trial
            <ArrowRight className="cta-button-icon" />
          </button>
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
    </section>
  );
}