import { useState } from "react";
import { Users, Wallet, Calendar, Mic, MessageSquare } from "lucide-react";
import "./InfoFeatures.css";

const FEATURES = [
  {
    id: "directory",
    icon: Users,
    label: "Directory",
    title: "Member Directory & Directory Management",
    description:
      "Comprehensive member profiles with contact details, family groups, attendance history, and role-based access controls.",
    benefits: [
      "Centralized member database",
      "Family grouping & relationships",
      "Attendance & engagement tracking",
      "Role-based permissions",
    ],
    gradient: "from-blue-900 to-blue-600",
  },
  {
    id: "giving",
    icon: Wallet,
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
    gradient: "from-emerald-600 to-emerald-400",
  },
  {
    id: "events",
    icon: Calendar,
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
    gradient: "from-blue-700 to-blue-500",
  },
  {
    id: "media",
    icon: Mic,
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
    gradient: "from-emerald-500 to-green-400",
  },
  {
    id: "comms",
    icon: MessageSquare,
    label: "Communications",
    title: "Communications & SMS Broadcast",
    description:
      "Engage your congregation with email newsletters, SMS broadcasts, push notifications, and in-app messaging.",
    benefits: [
      "Email & newsletter campaigns",
      "SMS text broadcasting",
      "Push notifications",
      "Segment-based targeting",
    ],
    gradient: "from-blue-800 to-blue-600",
  },
];

export default function InfoFeatures() {
  const [activeTab, setActiveTab] = useState(FEATURES[0].id);
  const activeFeature = FEATURES.find((f) => f.id === activeTab) || FEATURES[0];

  return (
    <section className="info-features" id="features">
      <div className="info-features-container">
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

        <div className="info-features-tabs">
          {FEATURES.map((feature) => {
            const Icon = feature.icon;
            const isActive = activeTab === feature.id;
            return (
              <button
                key={feature.id}
                onClick={() => setActiveTab(feature.id)}
                className={`info-tab ${isActive ? "info-tab-active" : ""}`}
              >
                <Icon className="info-tab-icon" />
                {feature.label}
              </button>
            );
          })}
        </div>

        <div className="info-feature-card">
          <div className="info-feature-card-content">
            <div className="info-feature-card-left">
              <div className={`info-feature-card-icon ${activeFeature.gradient}`}>
                <activeFeature.icon className="info-feature-card-icon-svg" />
              </div>
              <h3 className="info-feature-card-title">{activeFeature.title}</h3>
              <p className="info-feature-card-desc">{activeFeature.description}</p>
            </div>
            <div className="info-feature-card-right">
              <h4 className="info-feature-card-benefits-title">Key Benefits</h4>
              <ul className="info-feature-card-benefits-list">
                {activeFeature.benefits.map((b) => (
                  <li key={b} className="info-feature-card-benefit">
                    <span className="info-feature-card-benefit-dot" />
                    {b}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}