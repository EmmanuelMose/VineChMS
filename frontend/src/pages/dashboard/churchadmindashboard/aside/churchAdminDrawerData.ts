import {
  FiHome,
  FiUsers,
  FiCalendar,
  FiHeart,
  FiDollarSign,
  FiClipboard,
  FiBook,
  FiMusic,
  FiCheckSquare,
  FiFile,
  FiBarChart2,
  FiTrendingUp,
  FiSettings,
  FiLogOut,
  FiBriefcase,
} from "react-icons/fi";
import { FaBullhorn, FaUserTie, FaHandshake, FaUserFriends } from "react-icons/fa";

export interface DrawerData {
  id: string;
  name: string;
  icon: React.ComponentType<{ size?: number }>;
  link: string;
}

export const churchAdminDrawerData: DrawerData[] = [
  {
    id: "dashboard",
    name: "Dashboard",
    icon: FiHome,
    link: "dashboard",
  },
  {
    id: "members",
    name: "Members",
    icon: FiUsers,
    link: "members",
  },
  {
    id: "leaders",
    name: "Leadership",
    icon: FaUserTie,
    link: "leaders",
  },
  {
    id: "positions",
    name: "Positions",
    icon: FiBriefcase,
    link: "positions",
  },
  {
    id: "services",
    name: "Services",
    icon: FiMusic,
    link: "services",
  },
  {
    id: "attendance",
    name: "Attendance",
    icon: FiCheckSquare,
    link: "attendance",
  },
  {
    id: "events",
    name: "Events",
    icon: FiCalendar,
    link: "events",
  },
  {
    id: "announcements",
    name: "Announcements",
    icon: FaBullhorn,
    link: "announcements",
  },
  {
    id: "prayer",
    name: "Prayer Requests",
    icon: FiHeart,
    link: "prayer",
  },
  {
    id: "giving",
    name: "Giving",
    icon: FiDollarSign,
    link: "giving",
  },
  {
    id: "expenses",
    name: "Expenses",
    icon: FiClipboard,
    link: "expenses",
  },
  {
    id: "pledges",
    name: "Pledges",
    icon: FaHandshake,
    link: "pledges",
  },
  {
    id: "visitors",
    name: "Visitors",
    icon: FaUserFriends,
    link: "visitors",
  },
  {
    id: "groups",
    name: "Groups",
    icon: FiUsers,
    link: "groups",
  },
  {
    id: "sermons",
    name: "Sermons",
    icon: FiBook,
    link: "sermons",
  },
  {
    id: "documents",
    name: "Documents",
    icon: FiFile,
    link: "documents",
  },
  {
    id: "reports",
    name: "Reports",
    icon: FiBarChart2,
    link: "reports",
  },
  {
    id: "analytics",
    name: "Analytics",
    icon: FiTrendingUp,
    link: "analytics",
  },
  {
    id: "settings",
    name: "Settings",
    icon: FiSettings,
    link: "settings",
  },
  {
    id: "logout",
    name: "Log Out",
    icon: FiLogOut,
    link: "logout",
  },
];