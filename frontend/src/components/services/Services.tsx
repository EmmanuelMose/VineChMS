import "./Services.css";

const SERVICES = [
  {
    title: "Church Management",
    description:
      "Complete church administration with member tracking, service scheduling, and attendance management.",
  },
  {
    title: "Financial Management",
    description:
      "Track giving, manage expenses, create budgets, and generate financial reports with ease.",
  },
  {
    title: "Communication Tools",
    description:
      "Send announcements, manage prayer requests, and keep your congregation informed and engaged.",
  },
  {
    title: "Community Building",
    description:
      "Create groups, manage events, and foster community engagement within your church.",
  },
  {
    title: "Content Management",
    description:
      "Upload sermons, manage documents, and organize your church's digital content in one place.",
  },
  {
    title: "Security & Compliance",
    description:
      "Role-based access control, audit trails, and secure data management for peace of mind.",
  },
  {
    title: "Volunteer Coordination",
    description:
      "Easily schedule volunteers, track service hours, and manage ministry teams.",
  },
  {
    title: "Visitor Management",
    description:
      "Capture visitor information, follow up automatically, and integrate new visitors into your church.",
  },
];

export default function Services() {
  return (
    <section className="services" id="services">
      <div className="services-container">
        <div className="services-header">
          <span className="services-tag">What We Offer</span>
          <h2 className="services-title">
            Comprehensive <span className="services-title-highlight">Church Management</span> Services
          </h2>
          <p className="services-subtitle">
            VineChMS provides everything you need to manage your church efficiently and effectively.
          </p>
        </div>

        <div className="services-carousel-wrapper">
          <div className="services-carousel">
            {SERVICES.concat(SERVICES).map((service, index) => (
              <div className="service-card" key={index}>
                <div className="service-card-dot"></div>
                <h3>{service.title}</h3>
                <p>{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}