import { useState, useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import ChurchAdminDrawer from "./aside/ChurchAdminDrawer";
import { FiMenu, FiX, FiUser, FiChevronDown, FiLogOut, FiAlertCircle } from "react-icons/fi";
import { clearUser } from "../../../Features/userSlice";
import { fetchChurchById } from "../../../Features/churches/churchesAPI";
import "./ChurchAdminDashboard.css";

export default function ChurchAdminDashboard() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [churchName, setChurchName] = useState("");
  const [, setLoadingChurch] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state: any) => state.user.user);
  const token = useSelector((state: any) => state.user.token);
  const churchId = useSelector((state: any) => state.user.user?.churchId);

  useEffect(() => {
    const loadChurch = async () => {
      if (churchId && token) {
        try {
          const church = await fetchChurchById(churchId, token);
          setChurchName(church.name || "My Church");
        } catch (error) {
          console.error("Failed to load church:", error);
          setChurchName("My Church");
        } finally {
          setLoadingChurch(false);
        }
      } else {
        setChurchName("My Church");
        setLoadingChurch(false);
      }
    };
    loadChurch();
  }, [churchId, token]);

  const toggleDrawer = () => {
    setIsDrawerOpen((prev) => !prev);
    if (window.innerWidth <= 768) {
      setIsMobileMenuOpen(!isMobileMenuOpen);
    }
  };

  const handleLogout = () => {
    dispatch(clearUser());
    navigate("/");
    setShowLogoutModal(false);
  };

  const handleProfileClick = () => {
    navigate("/dashboard/church-admin/settings");
    setIsProfileOpen(false);
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
      dashboard: "Dashboard",
      members: "Members",
      leaders: "Leadership",
      positions: "Positions",
      services: "Services",
      attendance: "Attendance",
      events: "Events",
      announcements: "Announcements",
      prayer: "Prayer Requests",
      giving: "Giving",
      expenses: "Expenses",
      pledges: "Pledges",
      visitors: "Visitors",
      groups: "Groups",
      sermons: "Sermons",
      documents: "Documents",
      reports: "Reports",
      analytics: "Analytics",
      settings: "Settings",
    };
    return titles[path || "dashboard"] || "Dashboard";
  };

  const getInitials = () => {
    if (user?.fullName) {
      return user.fullName
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
    }
    return "CA";
  };

  return (
    <div className="church-admin-dashboard">
      <div className="church-admin-dashboard-container">
        <div className="church-admin-dashboard-layout">
          <div className={`church-admin-dashboard-drawer-wrapper ${isMobileMenuOpen ? "mobile-open" : ""}`}>
            <ChurchAdminDrawer
              isSidebarOpen={isDrawerOpen}
              onToggle={toggleDrawer}
              onCloseMobile={() => setIsMobileMenuOpen(false)}
              onLogout={() => setShowLogoutModal(true)}
            />
          </div>

          <div className="church-admin-dashboard-main">
            <header className="church-admin-dashboard-header">
              <div className="church-admin-dashboard-header-left">
                <button
                  onClick={toggleDrawer}
                  className="church-admin-dashboard-menu-btn"
                  aria-label="Toggle menu"
                >
                  {isMobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
                </button>
                <div className="church-admin-dashboard-header-info">
                  <h1 className="church-admin-dashboard-title">{getPageTitle()}</h1>
                  <p className="church-admin-dashboard-subtitle">
                    {churchName || "My Church"} • {user?.fullName || "Admin"}
                  </p>
                </div>
              </div>

              <div className="church-admin-dashboard-header-right">
                <div
                  className="church-admin-dashboard-profile"
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                >
                  <div className="church-admin-dashboard-profile-avatar">
                    {user?.profilePicture ? (
                      <img 
                        src={user.profilePicture} 
                        alt="Profile" 
                        className="church-admin-dashboard-profile-image"
                      />
                    ) : (
                      getInitials()
                    )}
                  </div>
                  <div className="church-admin-dashboard-profile-info">
                    <span className="church-admin-dashboard-profile-name">
                      {user?.fullName || "Admin"}
                    </span>
                    <span className="church-admin-dashboard-profile-role">
                      Church Admin
                    </span>
                  </div>
                  <FiChevronDown
                    size={16}
                    className={`church-admin-dashboard-profile-arrow ${isProfileOpen ? "rotated" : ""}`}
                  />
                </div>

                {isProfileOpen && (
                  <div className="church-admin-dashboard-profile-dropdown">
                    <div className="church-admin-dashboard-dropdown-item" onClick={handleProfileClick}>
                      <FiUser size={16} />
                      <span>Settings</span>
                    </div>
                    <div className="church-admin-dashboard-dropdown-divider"></div>
                    <div className="church-admin-dashboard-dropdown-item logout-item" onClick={() => setShowLogoutModal(true)}>
                      <FiLogOut size={16} />
                      <span>Log Out</span>
                    </div>
                  </div>
                )}
              </div>
            </header>

            <main className="church-admin-dashboard-content">
              <div className="church-admin-dashboard-content-inner">
                <Outlet />
              </div>
            </main>

            <footer className="church-admin-dashboard-footer">
              <span>© {new Date().getFullYear()} VineChMS. All rights reserved.</span>
            </footer>
          </div>
        </div>
      </div>

      {showLogoutModal && (
        <div className="church-admin-logout-modal-overlay" onClick={() => setShowLogoutModal(false)}>
          <div className="church-admin-logout-modal" onClick={(e) => e.stopPropagation()}>
            <div className="church-admin-logout-modal-icon">
              <FiAlertCircle />
            </div>
            <h3>Are you sure you want to logout?</h3>
            <p>You will be redirected to the home page. Any unsaved changes will be lost.</p>
            <div className="church-admin-logout-modal-actions">
              <button
                className="church-admin-logout-modal-cancel"
                onClick={() => setShowLogoutModal(false)}
              >
                Cancel
              </button>
              <button
                className="church-admin-logout-modal-confirm"
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}