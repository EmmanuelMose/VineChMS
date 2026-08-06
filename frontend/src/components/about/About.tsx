import "./About.css";

export default function About() {
  return (
    <section className="about" id="hierarchy">
      <div className="about-container">
        <div className="about-header">
          <span className="about-tag">Multi-Tenant Architecture</span>
          <h2 className="about-title">
            Built for Every Level of <span className="about-title-highlight">Church Governance</span>
          </h2>
          <p className="about-subtitle">
            A hierarchical platform that scales from individual members to global dioceses,
            with role-based access at every level.
          </p>
        </div>

        <div className="about-grid">
          <div className="about-card">
            <div className="about-card-icon">
              <span className="about-card-dot"></span>
            </div>
            <h3>Large Organization</h3>
            <p className="about-card-sub">Diocese / Synod / District</p>
            <ul className="about-card-list">
              <li>Global policy management</li>
              <li>Subscription & billing oversight</li>
              <li>Multi-org analytics</li>
              <li>Centralized reporting</li>
            </ul>
          </div>

          <div className="about-card">
            <div className="about-card-icon">
              <span className="about-card-dot"></span>
            </div>
            <h3>Organization</h3>
            <p className="about-card-sub">Regional Administration</p>
            <ul className="about-card-list">
              <li>Regional church oversight</li>
              <li>Staff management</li>
              <li>Budget allocation</li>
              <li>Compliance monitoring</li>
            </ul>
          </div>

          <div className="about-card">
            <div className="about-card-icon">
              <span className="about-card-dot"></span>
            </div>
            <h3>Church</h3>
            <p className="about-card-sub">Local Congregation</p>
            <ul className="about-card-list">
              <li>Member directory & groups</li>
              <li>Service scheduling</li>
              <li>Financial tracking</li>
              <li>Event management</li>
            </ul>
          </div>

          <div className="about-card">
            <div className="about-card-icon">
              <span className="about-card-dot"></span>
            </div>
            <h3>Members</h3>
            <p className="about-card-sub">Individual Profiles</p>
            <ul className="about-card-list">
              <li>Personal profile</li>
              <li>Giving history</li>
              <li>Group participation</li>
              <li>Event registration</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}