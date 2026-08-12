import { useState } from "react";
import SunriseImage from "../../assets/images/Sunrise.jpg";
import "./InfoFeatures.css";

interface Feature {
  id: string;
  label: string;
  title: string;
  description: string;
  benefits: string[];
  color: string;
}

const FEATURES: Feature[] = [
  {
    id: "directory",
    label: "Directory",
    title: "Member Directory & Management",
    description:
      "Comprehensive member profiles with contact details, family groups, attendance history, and role-based access controls.",
    benefits: [
      "Centralized member database",
      "Family grouping & relationships",
      "Attendance & engagement tracking",
      "Role-based permissions",
    ],
    color: "#1565C0",
  },
  {
    id: "giving",
    label: "Giving",
    title: "Giving & Financial Management",
    description:
      "Online giving, pledge tracking, expense management, and real-time financial reporting across all entities.",
    benefits: [
      "Online donations & recurring giving",
      "Pledge & campaign tracking",
      "Expense approval workflows",
      "Multi-entity financial reports",
    ],
    color: "#2E7D32",
  },
  {
    id: "events",
    label: "Events",
    title: "Event & Service Scheduling",
    description:
      "Schedule services, events, and meetings with resource management, volunteer coordination, and calendar sync.",
    benefits: [
      "Service planning & liturgy builder",
      "Resource & room scheduling",
      "Volunteer sign-ups & coordination",
      "Calendar sync & reminders",
    ],
    color: "#1565C0",
  },
  {
    id: "media",
    label: "Media",
    title: "Sermon & Media Archives",
    description:
      "Upload, organize, and stream sermons, worship sets, and media content with searchable archives.",
    benefits: [
      "Sermon recording & uploading",
      "Series & topic organization",
      "Multi-format media support",
      "Embedded player & sharing",
    ],
    color: "#2E7D32",
  },
  {
    id: "comms",
    label: "Comms",
    title: "Communications & SMS Broadcast",
    description:
      "Engage your congregation with email newsletters, SMS broadcasts, push notifications, and in-app messaging.",
    benefits: [
      "Email & newsletter campaigns",
      "SMS text broadcasting",
      "Push notifications",
      "Segment-based targeting",
    ],
    color: "#1565C0",
  },
];

export default function InfoFeatures() {
  const [activeTab, setActiveTab] = useState<string>(FEATURES[0].id);
  const activeFeature = FEATURES.find((f) => f.id === activeTab) || FEATURES[0];

  return (
    <section className="info-features" id="features">
      <div className="info-features-container">
        <div className="info-features-grid">
          <div className="info-features-left">
            <div className="info-features-image-wrapper">
              <img src={SunriseImage} alt="Sunrise" className="info-features-image" />
              <div className="info-features-image-overlay"></div>
            </div>
          </div>

          <div className="info-features-right-wrapper">
            <div className="info-features-header">
              <span className="info-features-tag">Core Services</span>
              <h2 className="info-features-title">
                Everything You Need to
                <br />
                <span className="info-features-title-highlight">Manage Your Church</span>
              </h2>
              <p className="info-features-subtitle">
                Five integrated service pillars designed to streamline every aspect
                of church operations.
              </p>
            </div>

            <div className="info-features-right">
              <div className="info-features-tabs">
                {FEATURES.map((feature) => {
                  const isActive = activeTab === feature.id;
                  return (
                    <button
                      key={feature.id}
                      onClick={() => setActiveTab(feature.id)}
                      className={`info-tab ${isActive ? "info-tab-active" : ""}`}
                      style={{
                        borderColor: isActive ? "#FFC107" : "#e5e7eb",
                        color: isActive ? "#FFC107" : "#4b5563",
                        background: isActive ? "rgba(255,193,7,0.08)" : "#f9fafb",
                      }}
                    >
                      {feature.label}
                    </button>
                  );
                })}
              </div>

              <div className="info-feature-card">
                <div className="info-feature-card-content">
                  <div className="info-feature-card-left">
                    <div className="info-feature-card-dot" style={{ background: activeFeature.color }}></div>
                    <h3 className="info-feature-card-title">{activeFeature.title}</h3>
                    <p className="info-feature-card-desc">{activeFeature.description}</p>
                  </div>
                  <div className="info-feature-card-right">
                    <h4 className="info-feature-card-benefits-title">Key Benefits</h4>
                    <ul className="info-feature-card-benefits-list">
                      {activeFeature.benefits.map((b) => (
                        <li key={b} className="info-feature-card-benefit">
                          <span className="info-feature-card-benefit-dot" style={{ background: activeFeature.color }} />
                          {b}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}