import './CTA.css';

const CTA = () => {
  return (
    <section className="cta" id="pricing">
      <div className="cta-container">
        <div className="cta-content">
          <h2 className="cta-title">
            Get Started Today
          </h2>
          <p className="cta-subtitle">
            Ready to Transform Your Church Management?
          </p>
          <p className="cta-description">
            Join 340+ churches already using VineChMS. Start your free trial today — no credit card required.
          </p>
          <div className="cta-buttons">
            <button className="cta-btn-primary">Start Free Trial →</button>
            <button className="cta-btn-secondary">Watch Demo</button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;