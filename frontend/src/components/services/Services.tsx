import "./Services.css";

export default function Services() {
  return (
    <section className="services" id="services">
      <div className="services-container">
        <div className="services-header">
          <span className="services-tag">WHAT WE OFFER</span>
          <h2 className="services-title">Comprehensive Church Management Services</h2>
          <p className="services-subtitle">
            VineChMS provides everything you need to manage your church efficiently and effectively.
          </p>
        </div>

        <div className="services-grid">
          <div className="service-card">
            <div className="service-icon">📖</div>
            <h3>Church Management</h3>
            <p>Complete church administration with member tracking, service scheduling, and attendance management.</p>
          </div>

          <div className="service-card">
            <div className="service-icon">💳</div>
            <h3>Financial Management</h3>
            <p>Track giving, manage expenses, create budgets, and generate financial reports with ease.</p>
          </div>

          <div className="service-card">
            <div className="service-icon">📢</div>
            <h3>Communication Tools</h3>
            <p>Send announcements, manage prayer requests, and keep your congregation informed and engaged.</p>
          </div>

          <div className="service-card">
            <div className="service-icon">🎯</div>
            <h3>Community Building</h3>
            <p>Create groups, manage events, and foster community engagement within your church.</p>
          </div>

          <div className="service-card">
            <div className="service-icon">📹</div>
            <h3>Content Management</h3>
            <p>Upload sermons, manage documents, and organize your church's digital content in one place.</p>
          </div>

          <div className="service-card">
            <div className="service-icon">🛡️</div>
            <h3>Security & Compliance</h3>
            <p>Role-based access control, audit trails, and secure data management for peace of mind.</p>
          </div>
        </div>
      </div>
    </section>
  );
}