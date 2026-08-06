import {
  FiHome,
  FiUsers,
  FiUserCheck,
  FiCalendar,
  FiCheckSquare,
  FiDollarSign,
  FiCreditCard,
  FiCalendar as FiEvent,
  FiHeart,
  FiUsers as FiGroups,
  FiBook,
  FiBarChart2,
  FiSettings,
  FiFile,
  FiLogOut,
} from "react-icons/fi";

import { FaBullhorn } from "react-icons/fa";

export type DrawerData = {
  id: string;
  name: string;
  icon: React.ComponentType<{ size?: number }>;
  link: string;
};

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
    name: "Leaders",
    icon: FiUserCheck,
    link: "leaders",
  },
  {
    id: "services",
    name: "Services",
    icon: FiCalendar,
    link: "services",
  },
  {
    id: "attendance",
    name: "Attendance",
    icon: FiCheckSquare,
    link: "attendance",
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
    icon: FiCreditCard,
    link: "expenses",
  },
  {
    id: "events",
    name: "Events",
    icon: FiEvent,
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
    id: "groups",
    name: "Groups",
    icon: FiGroups,
    link: "groups",
  },
  {
    id: "sermons",
    name: "Sermons",
    icon: FiBook,
    link: "sermons",
  },
  {
    id: "reports",
    name: "Reports",
    icon: FiBarChart2,
    link: "reports",
  },
  {
    id: "documents",
    name: "Documents",
    icon: FiFile,
    link: "documents",
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