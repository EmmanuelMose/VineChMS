import { NavLink } from "react-router-dom";
import { memberDrawerData, type DrawerData } from "./ChurchMemberDrawerData";
import { FiChevronLeft, FiChevronRight, FiLogOut } from "react-icons/fi";
import { ROLE_DISPLAY_NAMES } from "../../../../utils/permissions";
import { useMemo } from "react";
import "./ChurchMemberDrawer.css";

type ChurchMemberDrawerProps = {
  isSidebarOpen: boolean;
  onToggle: () => void;
  onCloseMobile: () => void;
  onLogout: () => void;
  userName?: string;
  userRole?: string;
};

const ChurchMemberDrawer = ({
  isSidebarOpen,
  onToggle,
  onCloseMobile,
  onLogout,
  userName = "Member",
  userRole = "church_member",
}: ChurchMemberDrawerProps) => {
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

  const filteredNavItems = useMemo(() => {
    return memberDrawerData.filter((item) => {
      if (!item.roles) return true;
      return item.roles.includes(userRole as any);
    });
  }, [userRole]);

  const displayRole = ROLE_DISPLAY_NAMES[userRole as keyof typeof ROLE_DISPLAY_NAMES] || "Member";

  return (
    <aside
      className={`church-member-drawer ${isSidebarOpen ? "church-member-drawer-open" : "church-member-drawer-closed"}`}
    >
      <div className="church-member-drawer-header">
        <div className="church-member-drawer-brand">
          <span className="church-member-drawer-brand-icon">⛪</span>
          <span className={`church-member-drawer-title ${isSidebarOpen ? "opacity-100" : "opacity-0"}`}>
            Vine<span className="church-member-drawer-brand-highlight">ChMS</span>
          </span>
        </div>
        <button onClick={onToggle} className="church-member-drawer-toggle">
          {isSidebarOpen ? <FiChevronLeft size={18} /> : <FiChevronRight size={18} />}
        </button>
      </div>

      <div className="church-member-drawer-user">
        <div className="church-member-drawer-user-avatar">{getInitials()}</div>
        <div className={`church-member-drawer-user-info ${isSidebarOpen ? "opacity-100" : "opacity-0"}`}>
          <span className="church-member-drawer-user-name">{userName}</span>
          <span className="church-member-drawer-user-role">{displayRole}</span>
        </div>
      </div>

      <nav className="church-member-drawer-nav">
        {filteredNavItems.map((item: DrawerData) => {
          if (item.id === "logout") {
            return (
              <button key={item.id} onClick={onLogout} className="church-member-drawer-logout">
                <span className="church-member-drawer-icon">
                  <FiLogOut size={20} />
                </span>
                {isSidebarOpen && <span className="church-member-drawer-text">{item.name}</span>}
              </button>
            );
          }

          return (
            <NavLink
              key={item.id}
              to={item.link}
              onClick={handleLinkClick}
              className={({ isActive }) =>
                `church-member-drawer-link ${isActive ? "church-member-drawer-link-active" : ""}`
              }
            >
              <span className="church-member-drawer-icon">
                <item.icon size={20} />
              </span>
              {isSidebarOpen && <span className="church-member-drawer-text">{item.name}</span>}
            </NavLink>
          );
        })}
      </nav>

      <div className="church-member-drawer-footer">
        <span className="church-member-drawer-footer-text">v2.0 • {new Date().getFullYear()}</span>
      </div>
    </aside>
  );
};

export default ChurchMemberDrawer;