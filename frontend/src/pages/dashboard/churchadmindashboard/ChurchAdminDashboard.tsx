import { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import ChurchAdminDrawer from "./aside/ChurchAdminDrawer";
import { FiMenu, FiX, FiUser, FiChevronDown } from "react-icons/fi";
import "./ChurchAdminDashboard.css";

export default function ChurchAdminDashboard() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const location = useLocation();
  const user = useSelector((state: any) => state.user.user);

  const toggleDrawer = () => {
    setIsDrawerOpen((prev) => !prev);
    if (window.innerWidth <= 768) {
      setIsMobileMenuOpen(!isMobileMenuOpen);
    }
  };


  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setIsMobileMenuOpen(false);
        setIsDrawerOpen(true);
      } else {
        setIsDrawerOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const getPageTitle = () => {
    const path = location.pathname.split("/").pop();
    const titles: Record<string, string> = {
      dashboard: "Dashboard Overview",
      members: "Member Management",
      leaders: "Leadership Management",
      services: "Service Management",
      attendance: "Attendance Tracking",
      giving: "Giving & Donations",
      expenses: "Expense Management",
      events: "Event Management",
      announcements: "Announcements",
      prayer: "Prayer Requests",
      groups: "Groups & Small Groups",
      sermons: "Sermon Library",
      reports: "Reports & Analytics",
      documents: "Document Management",
      settings: "Church Settings",
    };
    return titles[path || "dashboard"] || "Dashboard";
  };

  const getInitials = () => {
    if (user?.fullName) {
      return user.fullName.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2);
    }
    return "CA";
  };

  return (
    <div className="church-dashboard">
      <div className="church-dashboard-container">
        <div className="church-dashboard-layout">
          <div className={`church-dashboard-drawer-wrapper ${isMobileMenuOpen ? "mobile-open" : ""}`}>
            <ChurchAdminDrawer
              isSidebarOpen={isDrawerOpen}
              onToggle={toggleDrawer} onCloseMobile={function (): void {
                throw new Error("Function not implemented.");
              } }            />
          </div>

          <div className="church-dashboard-main">
            <header className="church-dashboard-header">
              <div className="church-dashboard-header-left">
                <button
                  onClick={toggleDrawer}
                  className="church-dashboard-menu-btn"
                  aria-label="Toggle menu"
                >
                  {isMobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
                </button>
                <div className="church-dashboard-header-info">
                  <h1 className="church-dashboard-title">{getPageTitle()}</h1>
                  <p className="church-dashboard-subtitle">
                    {user?.churchId ? "Managing your church operations" : "Welcome to your dashboard"}
                  </p>
                </div>
              </div>

              <div className="church-dashboard-header-right">
                <div 
                  className="church-dashboard-profile"
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                >
                  <div className="church-dashboard-profile-avatar">
                    {getInitials()}
                  </div>
                  <div className="church-dashboard-profile-info">
                    <span className="church-dashboard-profile-name">
                      {user?.fullName || "Church Admin"}
                    </span>
                    <span className="church-dashboard-profile-role">
                      {user?.role?.replace("_", " ") || "Administrator"}
                    </span>
                  </div>
                  <FiChevronDown 
                    size={16} 
                    className={`church-dashboard-profile-arrow ${isProfileOpen ? "rotated" : ""}`}
                  />
                </div>

                {isProfileOpen && (
                  <div className="church-dashboard-profile-dropdown">
                    <div className="church-dashboard-dropdown-item">
                      <FiUser size={16} />
                      <span>My Profile</span>
                    </div>
                    <div className="church-dashboard-dropdown-divider"></div>
                    <div className="church-dashboard-dropdown-item logout-item">
                      <span>Log Out</span>
                    </div>
                  </div>
                )}
              </div>
            </header>

            <main className="church-dashboard-content">
              <div className="church-dashboard-content-inner">
                <Outlet />
              </div>
            </main>

            <footer className="church-dashboard-footer">
              <span>© {new Date().getFullYear()} VineChMS. All rights reserved.</span>
            </footer>
          </div>
        </div>
      </div>
    </div>
  );
}