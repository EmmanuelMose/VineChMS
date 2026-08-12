import { NavLink } from "react-router-dom";
import { churchAdminDrawerData, type DrawerData } from "./churchAdminDrawerData";
import { FiChevronLeft, FiChevronRight, FiLogOut } from "react-icons/fi";
import "./ChurchAdminDrawer.css";

type ChurchAdminDrawerProps = {
  isSidebarOpen: boolean;
  onToggle: () => void;
  onCloseMobile: () => void;
  onLogout: () => void;
  userName?: string;
};

const ChurchAdminDrawer = ({
  isSidebarOpen,
  onToggle,
  onCloseMobile,
  onLogout,
  userName = "Admin",
}: ChurchAdminDrawerProps) => {
  const handleLinkClick = () => {
    if (window.innerWidth <= 768) {
      onCloseMobile();
    }
  };

  const getInitials = () => {
    return userName
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <aside
      className={`church-admin-drawer ${isSidebarOpen ? "church-admin-drawer-open" : "church-admin-drawer-closed"}`}
    >
      <div className="church-admin-drawer-header">
        <div className="church-admin-drawer-brand">
          <span className="church-admin-drawer-brand-icon">⛪</span>
          <span className={`church-admin-drawer-title ${isSidebarOpen ? "opacity-100" : "opacity-0"}`}>
            Vine<span className="church-admin-drawer-brand-highlight">ChMS</span>
          </span>
        </div>
        <button onClick={onToggle} className="church-admin-drawer-toggle">
          {isSidebarOpen ? <FiChevronLeft size={18} /> : <FiChevronRight size={18} />}
        </button>
      </div>

      <div className="church-admin-drawer-user">
        <div className="church-admin-drawer-user-avatar">{getInitials()}</div>
        <div className={`church-admin-drawer-user-info ${isSidebarOpen ? "opacity-100" : "opacity-0"}`}>
          <span className="church-admin-drawer-user-name">{userName}</span>
          <span className="church-admin-drawer-user-role">Church Admin</span>
        </div>
      </div>

      <nav className="church-admin-drawer-nav">
        {churchAdminDrawerData.map((item: DrawerData) => {
          if (item.id === "logout") {
            return (
              <button key={item.id} onClick={onLogout} className="church-admin-drawer-logout">
                <span className="church-admin-drawer-icon">
                  <FiLogOut size={20} />
                </span>
                {isSidebarOpen && <span className="church-admin-drawer-text">{item.name}</span>}
              </button>
            );
          }

          return (
            <NavLink
              key={item.id}
              to={item.link}
              onClick={handleLinkClick}
              className={({ isActive }) =>
                `church-admin-drawer-link ${isActive ? "church-admin-drawer-link-active" : ""}`
              }
            >
              <span className="church-admin-drawer-icon">
                <item.icon size={20} />
              </span>
              {isSidebarOpen && <span className="church-admin-drawer-text">{item.name}</span>}
            </NavLink>
          );
        })}
      </nav>

      <div className="church-admin-drawer-footer">
        <span className="church-admin-drawer-footer-text">v2.0 • {new Date().getFullYear()}</span>
      </div>
    </aside>
  );
};

export default ChurchAdminDrawer;