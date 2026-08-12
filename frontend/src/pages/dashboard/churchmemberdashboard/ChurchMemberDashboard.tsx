import { useState, useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import ChurchMemberDrawer from "./aside/ChurchMemberDrawer";
import { FiMenu, FiX, FiUser, FiChevronDown, FiLogOut, FiAlertCircle } from "react-icons/fi";
import { clearUser } from "../../../Features/userSlice";
import { fetchChurchById } from "../../../Features/churches/churchesAPI";
import { ROLE_DISPLAY_NAMES } from "../../../utils/permissions";
import "./ChurchMemberDashboard.css";

export default function ChurchMemberDashboard() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [churchName, setChurchName] = useState("My Church");
  const [, setLoadingChurch] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const user = useSelector((state: any) => state.user.user);
  const token = useSelector((state: any) => state.user.token);
  const churchId = useSelector((state: any) => state.user.user?.churchId);
  const userRole = useSelector((state: any) => state.user.user?.role);

  useEffect(() => {
    const loadChurch = async () => {
      if (churchId && token) {
        try {
          const church = await fetchChurchById(churchId, token);
          setChurchName(church.name || "My Church");
        } catch (error: any) {
          console.error("Failed to load church:", error);
          if (error.response?.status === 403) {
            setChurchName("My Church");
          } else {
            setChurchName("My Church");
          }
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
    navigate("/dashboard/member/profile");
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
      announcements: "Announcements",
      events: "Events",
      sermons: "Sermons",
      services: "Services",
      prayer: "Prayer Requests",
      groups: "Groups",
      attendance: "Attendance",
      giving: "Giving",
      expenses: "Expenses",
      pledges: "My Pledges",
      visitors: "Visitors",
      positions: "Leadership Positions",
      leadership: "My Leadership",
      reports: "Reports",
      analytics: "Analytics",
      documents: "Documents",
      profile: "My Profile",
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
    return "CM";
  };

  const displayRole = ROLE_DISPLAY_NAMES[userRole as keyof typeof ROLE_DISPLAY_NAMES] || "Member";

  return (
    <div className="church-member-dashboard">
      <div className="church-member-dashboard-container">
        <div className="church-member-dashboard-layout">
          <div className={`church-member-dashboard-drawer-wrapper ${isMobileMenuOpen ? "mobile-open" : ""}`}>
            <ChurchMemberDrawer
              isSidebarOpen={isDrawerOpen}
              onToggle={toggleDrawer}
              onCloseMobile={() => setIsMobileMenuOpen(false)}
              onLogout={() => setShowLogoutModal(true)}
              userName={user?.fullName || "Member"}
              userRole={userRole}
            />
          </div>

          <div className="church-member-dashboard-main">
            <header className="church-member-dashboard-header">
              <div className="church-member-dashboard-header-left">
                <button
                  onClick={toggleDrawer}
                  className="church-member-dashboard-menu-btn"
                  aria-label="Toggle menu"
                >
                  {isMobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
                </button>
                <div className="church-member-dashboard-header-info">
                  <h1 className="church-member-dashboard-title">{getPageTitle()}</h1>
                  <p className="church-member-dashboard-subtitle">
                    Welcome back, {user?.fullName || "Member"} • {churchName || "My Church"}
                  </p>
                </div>
              </div>

              <div className="church-member-dashboard-header-right">
                <div
                  className="church-member-dashboard-profile"
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                >
                  <div className="church-member-dashboard-profile-avatar">
                    {user?.profilePicture ? (
                      <img 
                        src={user.profilePicture} 
                        alt="Profile" 
                        className="church-member-dashboard-profile-image"
                      />
                    ) : (
                      getInitials()
                    )}
                  </div>
                  <div className="church-member-dashboard-profile-info">
                    <span className="church-member-dashboard-profile-name">
                      {user?.fullName || "Member"}
                    </span>
                    <span className="church-member-dashboard-profile-role">
                      {displayRole}
                    </span>
                  </div>
                  <FiChevronDown
                    size={16}
                    className={`church-member-dashboard-profile-arrow ${isProfileOpen ? "rotated" : ""}`}
                  />
                </div>

                {isProfileOpen && (
                  <div className="church-member-dashboard-profile-dropdown">
                    <div className="church-member-dashboard-dropdown-item" onClick={handleProfileClick}>
                      <FiUser size={16} />
                      <span>My Profile</span>
                    </div>
                    <div className="church-member-dashboard-dropdown-divider"></div>
                    <div className="church-member-dashboard-dropdown-item logout-item" onClick={() => setShowLogoutModal(true)}>
                      <FiLogOut size={16} />
                      <span>Log Out</span>
                    </div>
                  </div>
                )}
              </div>
            </header>

            <main className="church-member-dashboard-content">
              <div className="church-member-dashboard-content-inner">
                <Outlet />
              </div>
            </main>

            <footer className="church-member-dashboard-footer">
              <span>© {new Date().getFullYear()} VineChMS. All rights reserved.</span>
            </footer>
          </div>
        </div>
      </div>

      {showLogoutModal && (
        <div className="church-member-logout-modal-overlay" onClick={() => setShowLogoutModal(false)}>
          <div className="church-member-logout-modal" onClick={(e) => e.stopPropagation()}>
            <div className="church-member-logout-modal-icon">
              <FiAlertCircle />
            </div>
            <h3>Are you sure you want to logout?</h3>
            <p>You will be redirected to the home page. Any unsaved changes will be lost.</p>
            <div className="church-member-logout-modal-actions">
              <button
                className="church-member-logout-modal-cancel"
                onClick={() => setShowLogoutModal(false)}
              >
                Cancel
              </button>
              <button
                className="church-member-logout-modal-confirm"
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