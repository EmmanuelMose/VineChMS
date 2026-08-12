import {
  FiHome,
  FiCalendar,
  FiHeart,
  FiUsers,
  FiDollarSign,
  FiUser,
  FiLogOut,
  FiBook,
  FiCheckSquare,
  FiAward,
  FiBarChart2,
  FiFile,
  FiMusic,
  FiTrendingUp,
  FiClipboard,
  FiBriefcase,
} from "react-icons/fi";
import { FaBullhorn, FaHandshake, FaUserFriends } from "react-icons/fa";
import type { UserRole } from "../../../../utils/permissions";

export interface DrawerData {
  id: string;
  name: string;
  icon: React.ComponentType<{ size?: number }>;
  link: string;
  roles?: UserRole[];
}

export const memberDrawerData: DrawerData[] = [
  {
    id: "dashboard",
    name: "Dashboard",
    icon: FiHome,
    link: "dashboard",
    roles: ["church_member", "pastor", "elder", "treasurer", "secretary", "church_admin"],
  },
  {
    id: "announcements",
    name: "Announcements",
    icon: FaBullhorn,
    link: "announcements",
    roles: ["church_member", "pastor", "elder", "treasurer", "secretary", "church_admin"],
  },
  {
    id: "events",
    name: "Events",
    icon: FiCalendar,
    link: "events",
    roles: ["church_member", "pastor", "elder", "treasurer", "secretary", "church_admin"],
  },
  {
    id: "sermons",
    name: "Sermons",
    icon: FiBook,
    link: "sermons",
    roles: ["church_member", "pastor", "elder", "treasurer", "secretary", "church_admin"],
  },
  {
    id: "services",
    name: "Services",
    icon: FiMusic,
    link: "services",
    roles: ["pastor", "secretary", "church_admin"],
  },
  {
    id: "prayer",
    name: "Prayer Requests",
    icon: FiHeart,
    link: "prayer",
    roles: ["church_member", "pastor", "elder", "treasurer", "secretary", "church_admin"],
  },
  {
    id: "groups",
    name: "Groups",
    icon: FiUsers,
    link: "groups",
    roles: ["church_member", "pastor", "elder", "treasurer", "secretary", "church_admin"],
  },
  {
    id: "attendance",
    name: "Attendance",
    icon: FiCheckSquare,
    link: "attendance",
    roles: ["church_member", "pastor", "elder", "treasurer", "secretary", "church_admin"],
  },
  {
    id: "giving",
    name: "Giving",
    icon: FiDollarSign,
    link: "giving",
    roles: ["church_member", "pastor", "elder", "treasurer", "secretary", "church_admin"],
  },
  {
    id: "expenses",
    name: "Expenses",
    icon: FiClipboard,
    link: "expenses",
    roles: ["church_member", "pastor", "elder", "treasurer", "secretary", "church_admin"],
  },
  {
    id: "pledges",
    name: "My Pledges",
    icon: FaHandshake,
    link: "pledges",
    roles: ["church_member", "pastor", "elder", "treasurer", "secretary", "church_admin"],
  },
  {
    id: "visitors",
    name: "Visitors",
    icon: FaUserFriends,
    link: "visitors",
    roles: ["church_member", "pastor", "elder", "treasurer", "secretary", "church_admin"],
  },
  {
    id: "positions",
    name: "Leadership Positions",
    icon: FiBriefcase,
    link: "positions",
    roles: ["church_member", "pastor", "elder", "treasurer", "secretary", "church_admin"],
  },
  {
    id: "leadership",
    name: "My Leadership",
    icon: FiAward,
    link: "leadership",
    roles: ["church_member", "pastor", "elder", "treasurer", "secretary", "church_admin"],
  },
  {
    id: "reports",
    name: "Reports",
    icon: FiBarChart2,
    link: "reports",
    roles: ["pastor", "elder", "treasurer", "secretary", "church_admin"],
  },
  {
    id: "analytics",
    name: "Analytics",
    icon: FiTrendingUp,
    link: "analytics",
    roles: ["pastor", "elder", "treasurer", "secretary", "church_admin"],
  },
  {
    id: "documents",
    name: "Documents",
    icon: FiFile,
    link: "documents",
    roles: ["church_member", "pastor", "elder", "treasurer", "secretary", "church_admin"],
  },
  {
    id: "profile",
    name: "My Profile",
    icon: FiUser,
    link: "profile",
    roles: ["church_member", "pastor", "elder", "treasurer", "secretary", "church_admin"],
  },
  {
    id: "logout",
    name: "Log Out",
    icon: FiLogOut,
    link: "logout",
    roles: ["church_member", "pastor", "elder", "treasurer", "secretary", "church_admin"],
  },
];