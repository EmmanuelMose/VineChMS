import { NavLink, useNavigate } from "react-router-dom";
import { churchAdminDrawerData, type DrawerData } from "./churchAdminDrawerData";
import { useDispatch } from "react-redux";
import { clearUser } from "../../../../Features/userSlice";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import "./ChurchAdminDrawer.css";

type ChurchAdminDrawerProps = {
  isSidebarOpen: boolean;
  onToggle: () => void;
};

const ChurchAdminDrawer = ({
  isSidebarOpen,
  onToggle,
}: ChurchAdminDrawerProps) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(clearUser());
    navigate("/auth/login");
  };

  return (
    <aside
      className={`church-drawer ${isSidebarOpen ? "church-drawer-open" : "church-drawer-closed"}`}
    >
      <div className="church-drawer-header">
        <span className={`church-drawer-title ${isSidebarOpen ? "opacity-100" : "opacity-0"}`}>
          Church Admin
        </span>
        <button onClick={onToggle} className="church-drawer-toggle">
          {isSidebarOpen ? <FiChevronLeft size={20} /> : <FiChevronRight size={20} />}
        </button>
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
                  <item.icon size={22} />
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
              className={({ isActive }) =>
                `church-drawer-link ${isActive ? "church-drawer-link-active" : ""}`
              }
            >
              <span className="church-drawer-icon">
                <item.icon size={22} />
              </span>
              {isSidebarOpen && (
                <span className="church-drawer-text">{item.name}</span>
              )}
            </NavLink>
          );
        })}
      </nav>

      <div className="church-drawer-footer">
        <span className="church-drawer-footer-text">
          © {new Date().getFullYear()} VineChMS
        </span>
      </div>
    </aside>
  );
};

export default ChurchAdminDrawer;