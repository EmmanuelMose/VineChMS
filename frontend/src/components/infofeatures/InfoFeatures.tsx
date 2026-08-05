import './InfoFeatures.css';

const InfoFeatures = () => {
  return (
    <section className="info-features" id="features">
      <div className="info-features-container">
        <div className="info-features-header">
          <span className="info-features-tag">CORE MODULES</span>
          <h2 className="info-features-title">
            Everything You Need to Manage Your Church
          </h2>
          <p className="info-features-subtitle">
            From member check-ins to financial reporting, VineChMS provides every tool your ministry needs to thrive.
          </p>
        </div>

        <div className="info-features-grid">
          <div className="info-feature-card">
            <div className="info-feature-icon">👥</div>
            <h3>Member Management</h3>
            <p>Comprehensive member profiles with role-based access, attendance tracking, and group management.</p>
          </div>

          <div className="info-feature-card">
            <div className="info-feature-icon">💰</div>
            <h3>Giving & Finances</h3>
            <p>Track tithes, offerings, pledges, and generate detailed financial reports for full transparency.</p>
          </div>

          <div className="info-feature-card">
            <div className="info-feature-icon">📅</div>
            <h3>Event Registration</h3>
            <p>Create, promote, and manage church events with online registration and automated reminders.</p>
          </div>

          <div className="info-feature-card">
            <div className="info-feature-icon">🎙️</div>
            <h3>Sermon Archives</h3>
            <p>Upload, organize, and stream sermon recordings with searchable transcripts and notes.</p>
          </div>

          <div className="info-feature-card">
            <div className="info-feature-icon">✅</div>
            <h3>Governance & Approvals</h3>
            <p>Streamline decision-making with role-based approval workflows and meeting management.</p>
          </div>

          <div className="info-feature-card">
            <div className="info-feature-icon">📊</div>
            <h3>Attendance Tracking</h3>
            <p>Real-time check-in system for services, small groups, and special events with analytics.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default InfoFeatures;