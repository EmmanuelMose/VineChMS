import React, { useState, useEffect } from "react";
import { Menu, X, Church } from "lucide-react";
import "./Navbar.css";

interface NavLink {
  label: string;
  href: string;
}

const NAV_LINKS: NavLink[] = [
  { label: "Features", href: "#features" },
  { label: "Services", href: "#services" },
  { label: "Hierarchy", href: "#hierarchy" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState<boolean>(false);
  const [scrolled, setScrolled] = useState<boolean>(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleNav = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <header className={`navbar ${scrolled ? "navbar-glass" : "navbar-transparent"}`}>
      <div className="navbar-container">
        <a href="#" className="navbar-logo">
          <div className="logo-icon-wrapper">
            <Church className="logo-icon" />
          </div>
          <span className="logo-text">
            Vine<span className="logo-highlight">ChMS</span>
          </span>
        </a>

        <nav className="navbar-desktop">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => handleNav(e, link.href)}
              className="nav-link"
            >
              {link.label}
            </a>
          ))}
          <a
            href="#contact"
            onClick={(e) => handleNav(e, "#contact")}
            className="btn-get-started"
          >
            Get Started
          </a>
        </nav>

        <button
          onClick={() => setOpen(!open)}
          className="navbar-toggle"
          aria-label={open ? "Close menu" : "Open menu"}
        >
          {open ? <X className="toggle-icon" /> : <Menu className="toggle-icon" />}
        </button>
      </div>

      <div className={`mobile-menu ${open ? "mobile-menu-open" : ""}`}>
        <div className="mobile-menu-content">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => handleNav(e, link.href)}
              className="mobile-nav-link"
            >
              {link.label}
            </a>
          ))}
          <a
            href="#contact"
            onClick={(e) => handleNav(e, "#contact")}
            className="mobile-btn-get-started"
          >
            Get Started
          </a>
        </div>
      </div>
    </header>
  );
}