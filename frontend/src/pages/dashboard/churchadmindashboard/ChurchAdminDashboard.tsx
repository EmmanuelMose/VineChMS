import { useState } from "react";
import { Outlet } from "react-router-dom";
import ChurchAdminDrawer from "./aside/ChurchAdminDrawer";
import { FiMenu } from "react-icons/fi";
import "./ChurchAdminDashboard.css";

export default function ChurchAdminDashboard() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(true);

  const toggleDrawer = () => {
    setIsDrawerOpen((prev) => !prev);
  };

  return (
    <div className="church-dashboard">
      <div className="church-dashboard-container">
        <div className="church-dashboard-layout">
          <ChurchAdminDrawer
            isSidebarOpen={isDrawerOpen}
            onToggle={toggleDrawer}
          />

          <div className="church-dashboard-main">
            <header className="church-dashboard-header">
              <div className="church-dashboard-header-left">
                <button
                  onClick={toggleDrawer}
                  className="church-dashboard-menu-btn"
                  aria-label="Toggle menu"
                >
                  <FiMenu size={24} />
                </button>
                <div className="church-dashboard-header-info">
                  <h1 className="church-dashboard-title">Church Admin Dashboard</h1>
                  <p className="church-dashboard-subtitle">Manage your church operations</p>
                </div>
              </div>
              <div className="church-dashboard-header-right">
                <div className="church-dashboard-profile">
                  <span className="church-dashboard-profile-avatar">JD</span>
                  <div className="church-dashboard-profile-info">
                    <span className="church-dashboard-profile-name">John Doe</span>
                    <span className="church-dashboard-profile-role">Church Admin</span>
                  </div>
                </div>
              </div>
            </header>

            <main className="church-dashboard-content">
              <Outlet />
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