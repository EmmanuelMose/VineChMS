import './Hero.css';

const Hero = () => {
  return (
    <section className="hero">
      <div className="hero-container">
        <div className="hero-badge">
          <span className="badge-dot"></span>
          Trusted by 340+ Churches
        </div>

        <h1 className="hero-title">
          Empowering{' '}
          <span className="hero-highlight">Church</span>
          <br />
          Governance &amp; Dioceses
        </h1>

        <p className="hero-subtitle">
          From local congregations to global dioceses — VineChMS unifies
          member management, giving, events, and governance in one powerful platform.
        </p>

        <div className="hero-buttons">
          <button className="btn-primary">Start Free Trial →</button>
          <button className="btn-secondary">Explore Hierarchy</button>
        </div>

        <div className="hero-stats">
          <div className="stat-item">
            <span className="stat-number">12+</span>
            <span className="stat-label">Dioceses</span>
          </div>
          <div className="stat-divider"></div>
          <div className="stat-item">
            <span className="stat-number">340+</span>
            <span className="stat-label">Churches</span>
          </div>
          <div className="stat-divider"></div>
          <div className="stat-item">
            <span className="stat-number">99.9%</span>
            <span className="stat-label">Uptime</span>
          </div>
          <div className="stat-divider"></div>
          <div className="stat-item">
            <span className="stat-number">$4.2M</span>
            <span className="stat-label">Giving Tracked</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;