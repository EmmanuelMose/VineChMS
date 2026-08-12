import { ArrowRight, Shield, Users, Building2, Award, Church } from "lucide-react";
import HomeImage from "../../assets/images/HomeImage.jpg";
import "./Hero.css";

interface Stat {
  value: string;
  label: string;
  icon: React.ReactNode;
}

const STATS: Stat[] = [
  { value: "12+", label: "Dioceses", icon: <Building2 className="stat-icon" /> },
  { value: "340+", label: "Churches", icon: <Church className="stat-icon" /> },
  { value: "99.9%", label: "Uptime", icon: <Award className="stat-icon" /> },
  { value: "$4.2M", label: "Giving Tracked", icon: <Users className="stat-icon" /> },
];

export default function Hero() {
  const scrollTo = (href: string) => {
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="hero">
      <div className="hero-overlay"></div>
      <div className="hero-bg" style={{ backgroundImage: `url(${HomeImage})` }}></div>

      <div className="hero-blob top-right"></div>
      <div className="hero-blob bottom-left"></div>
      <div className="hero-blob center"></div>

      <div className="hero-grid-pattern"></div>

      <div className="hero-container">
        <div className="hero-content">
          <div className="hero-badge-wrapper">
            <div className="hero-badge">
              <Shield className="hero-badge-icon" />
              <span>Trusted by 340+ Churches Worldwide</span>
            </div>
          </div>

          <h1 className="hero-title">
            Empowering Church
            <br />
            <span className="hero-title-gradient">Governance &amp; Dioceses</span>
          </h1>

          <p className="hero-subtitle">
            All-in-one SaaS platform for church administration, member management,
            giving, and multi-tenant hierarchy across dioceses and congregations.
          </p>

          <p className="hero-description">
            Streamline operations, enhance member engagement, and grow your ministry 
            with our comprehensive church management solution.
          </p>

          <div className="hero-buttons">
            <button onClick={() => scrollTo("#contact")} className="btn-primary">
              Start Free Trial
              <ArrowRight className="btn-icon" />
            </button>
          </div>

          <div className="hero-stats">
            {STATS.map((stat) => (
              <div key={stat.label} className="stat-item">
                <div className="stat-icon-wrapper">{stat.icon}</div>
                <span className="stat-number">{stat.value}</span>
                <span className="stat-label">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}