import { NavLink, useNavigate } from "react-router-dom";
import { churchAdminDrawerData, type DrawerData } from "./churchAdminDrawerData";
import { useDispatch } from "react-redux";
import { clearUser } from "../../../../Features/userSlice";
import { FiChevronLeft, FiChevronRight, FiLogOut } from "react-icons/fi";
import "./ChurchAdminDrawer.css";

type ChurchAdminDrawerProps = {
  isSidebarOpen: boolean;
  onToggle: () => void;
  onCloseMobile: () => void;
};

const ChurchAdminDrawer = ({
  isSidebarOpen,
  onToggle,
  onCloseMobile,
}: ChurchAdminDrawerProps) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(clearUser());
    navigate("/auth/login");
  };

  const handleLinkClick = () => {
    if (window.innerWidth <= 768) {
      onCloseMobile();
    }
  };

  return (
    <aside
      className={`church-drawer ${isSidebarOpen ? "church-drawer-open" : "church-drawer-closed"}`}
    >
      <div className="church-drawer-header">
        <div className="church-drawer-brand">
          <span className="church-drawer-brand-icon">⛪</span>
          <span className={`church-drawer-title ${isSidebarOpen ? "opacity-100" : "opacity-0"}`}>
            Vine<span className="church-drawer-brand-highlight">ChMS</span>
          </span>
        </div>
        <button onClick={onToggle} className="church-drawer-toggle">
          {isSidebarOpen ? <FiChevronLeft size={18} /> : <FiChevronRight size={18} />}
        </button>
      </div>

      <div className="church-drawer-user">
        <div className="church-drawer-user-avatar">CA</div>
        <div className={`church-drawer-user-info ${isSidebarOpen ? "opacity-100" : "opacity-0"}`}>
          <span className="church-drawer-user-name">Church Admin</span>
          <span className="church-drawer-user-role">Administrator</span>
        </div>
      </div>

      <nav className="church-drawer-nav">
        {churchAdminDrawerData.map((item: DrawerData) => {
          if (item.id === "logout") {
            return (
              <button
                key={item.id}
                onClick={handleLogout}
                className="church-drawer-logout"
              >
                <span className="church-drawer-icon">
                  <FiLogOut size={20} />
                </span>
                {isSidebarOpen && (
                  <span className="church-drawer-text">{item.name}</span>
                )}
              </button>
            );
          }

          return (
            <NavLink
              key={item.id}
              to={item.link}
              onClick={handleLinkClick}
              className={({ isActive }) =>
                `church-drawer-link ${isActive ? "church-drawer-link-active" : ""}`
              }
            >
              <span className="church-drawer-icon">
                <item.icon size={20} />
              </span>
              {isSidebarOpen && (
                <span className="church-drawer-text">{item.name}</span>
              )}
              {isSidebarOpen && item.id === "dashboard" && (
                <span className="church-drawer-badge">New</span>
              )}
            </NavLink>
          );
        })}
      </nav>

      <div className="church-drawer-footer">
        <span className="church-drawer-footer-text">
          v2.0 • {new Date().getFullYear()}
        </span>
      </div>
    </aside>
  );
};

export default ChurchAdminDrawer;