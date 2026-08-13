// File: src/utils/permissions.ts

export type UserRole = 
  | "church_member"
  | "pastor"
  | "elder"
  | "treasurer"
  | "secretary"
  | "church_admin"
  | "super_admin"
  | "large_org_admin"
  | "large_org_member"
  | "small_org_admin"
  | "small_org_member";

export const ROLE_HIERARCHY: Record<UserRole, number> = {
  church_member: 1,
  pastor: 2,
  elder: 3,
  treasurer: 4,
  secretary: 5,
  church_admin: 6,
  large_org_member: 7,
  small_org_member: 8,
  large_org_admin: 9,
  small_org_admin: 10,
  super_admin: 11,
};

export const ROLE_DISPLAY_NAMES: Record<UserRole, string> = {
  church_member: "Church Member",
  pastor: "Pastor",
  elder: "Elder",
  treasurer: "Treasurer",
  secretary: "Secretary",
  church_admin: "Church Admin",
  super_admin: "Super Admin",
  large_org_admin: "Large Organization Admin",
  large_org_member: "Large Organization Member",
  small_org_admin: "Small Organization Admin",
  small_org_member: "Small Organization Member",
};

export const ROLE_BADGE_COLORS: Record<UserRole, string> = {
  church_member: "#6b7280",
  pastor: "#7C3AED",
  elder: "#1565C0",
  treasurer: "#059669",
  secretary: "#D97706",
  church_admin: "#DC2626",
  super_admin: "#1F2937",
  large_org_admin: "#2563EB",
  large_org_member: "#60A5FA",
  small_org_admin: "#7C3AED",
  small_org_member: "#8B5CF6",
};

export const POSITION_ICONS: Record<string, string> = {
  chairman: "👔",
  vice_chairman: "👔",
  secretary: "📋",
  treasurer: "💰",
  pastor: "👤",
  elder: "👴",
  deacon: "🤝",
  trustee: "🏛️",
  worship_leader: "🎵",
  youth_leader: "🧑",
  children_leader: "👶",
  prayer_leader: "🙏",
  usher: "🚪",
  media_leader: "📺",
  admin: "⚙️",
};

export interface Permission {
  id: string;
  name: string;
  description: string;
  roles: UserRole[];
}

export const PERMISSIONS = {
  VIEW_PROFILE: {
    id: "view_profile",
    name: "View Profile",
    description: "View user profile",
    roles: ["church_member", "pastor", "elder", "treasurer", "secretary", "church_admin"],
  },
  EDIT_PROFILE: {
    id: "edit_profile",
    name: "Edit Profile",
    description: "Edit user profile",
    roles: ["church_member", "pastor", "elder", "treasurer", "secretary", "church_admin"],
  },
  VIEW_ALL_MEMBERS: {
    id: "view_all_members",
    name: "View All Members",
    description: "View the complete member directory",
    roles: ["pastor", "elder", "secretary", "church_admin"],
  },
  MANAGE_MEMBERS: {
    id: "manage_members",
    name: "Manage Members",
    description: "Create, update, and delete members",
    roles: ["secretary", "church_admin"],
  },
  VIEW_SERMONS: {
    id: "view_sermons",
    name: "View Sermons",
    description: "View all sermons",
    roles: ["church_member", "pastor", "elder", "treasurer", "secretary", "church_admin"],
  },
  MANAGE_SERMONS: {
    id: "manage_sermons",
    name: "Manage Sermons",
    description: "Create, edit, and delete sermons",
    roles: ["pastor", "elder", "church_admin"],
  },
  VIEW_SERVICES: {
    id: "view_services",
    name: "View Services",
    description: "View all services",
    roles: ["church_member", "pastor", "elder", "secretary", "church_admin"],
  },
  MANAGE_SERVICES: {
    id: "manage_services",
    name: "Manage Services",
    description: "Create, edit, and delete services",
    roles: ["pastor", "church_admin"],
  },
  VIEW_ALL_ATTENDANCE: {
    id: "view_all_attendance",
    name: "View All Attendance",
    description: "View attendance for all members",
    roles: ["pastor", "elder", "secretary", "church_admin", "treasurer"],
  },
  VIEW_OWN_ATTENDANCE: {
    id: "view_own_attendance",
    name: "View Own Attendance",
    description: "View personal attendance records",
    roles: ["church_member", "pastor", "elder", "treasurer", "secretary", "church_admin"],
  },
  MANAGE_ATTENDANCE: {
    id: "manage_attendance",
    name: "Manage Attendance",
    description: "Create, update, and delete attendance records",
    roles: ["pastor", "church_admin", "elder", "secretary"],
  },
  VIEW_ALL_GIVING: {
    id: "view_all_giving",
    name: "View All Giving",
    description: "View all giving records",
    roles: ["treasurer", "church_admin", "pastor", "elder"],
  },
  VIEW_OWN_GIVING: {
    id: "view_own_giving",
    name: "View Own Giving",
    description: "View personal giving records only",
    roles: ["church_member", "pastor", "elder", "treasurer", "secretary", "church_admin"],
  },
  MANAGE_GIVING: {
    id: "manage_giving",
    name: "Manage Giving",
    description: "Create, update, and delete giving records",
    roles: ["treasurer", "church_admin", "pastor", "elder"],
  },
  CREATE_OWN_GIVING: {
    id: "create_own_giving",
    name: "Create Own Giving",
    description: "Create giving records for yourself only",
    roles: ["church_member", "pastor", "elder", "treasurer", "secretary", "church_admin"],
  },
  CREATE_GIVING_MPESA: {
    id: "create_giving_mpesa",
    name: "Create Giving via M-Pesa",
    description: "Send STK push for giving",
    roles: ["church_member", "pastor", "elder", "treasurer", "secretary", "church_admin"],
  },
  CREATE_GIVING_CASH: {
    id: "create_giving_cash",
    name: "Create Cash Giving",
    description: "Record cash giving with evidence",
    roles: ["church_member", "pastor", "elder", "treasurer", "secretary", "church_admin"],
  },
  CREATE_GIVING_FOR_OTHERS: {
    id: "create_giving_for_others",
    name: "Create Giving for Others",
    description: "Create giving records for other members",
    roles: ["treasurer", "church_admin"],
  },
  MANAGE_GIVING_CATEGORIES: {
    id: "manage_giving_categories",
    name: "Manage Giving Categories",
    description: "Create, update, and delete giving categories",
    roles: ["treasurer", "church_admin"],
  },
  APPROVE_GIVING: {
    id: "approve_giving",
    name: "Approve Giving",
    description: "Approve or reject giving records",
    roles: ["treasurer", "church_admin", "pastor", "elder"],
  },
  VIEW_ALL_EXPENSES: {
    id: "view_all_expenses",
    name: "View All Expenses",
    description: "View all expense records",
    roles: ["church_member", "pastor", "elder", "treasurer", "secretary", "church_admin"],
  },
  MANAGE_EXPENSES: {
    id: "manage_expenses",
    name: "Manage Expenses",
    description: "Create, update, and delete expenses",
    roles: ["treasurer", "church_admin"],
  },
  APPROVE_EXPENSES: {
    id: "approve_expenses",
    name: "Approve Expenses",
    description: "Approve or reject expenses",
    roles: ["pastor", "elder", "treasurer", "church_admin"],
  },
  PLEDGE_TO_EXPENSES: {
    id: "pledge_to_expenses",
    name: "Pledge to Expenses",
    description: "Pledge to pay for expenses",
    roles: ["church_member", "pastor", "elder", "treasurer", "secretary", "church_admin"],
  },
  VIEW_ALL_PRAYER_REQUESTS: {
    id: "view_all_prayer_requests",
    name: "View All Prayer Requests",
    description: "View all prayer requests",
    roles: ["pastor", "church_admin", "elder", "treasurer", "secretary"],
  },
  VIEW_OWN_PRAYER_REQUESTS: {
    id: "view_own_prayer_requests",
    name: "View Own Prayer Requests",
    description: "View personal prayer requests",
    roles: ["church_member"],
  },
  MANAGE_PRAYER_REQUESTS: {
    id: "manage_prayer_requests",
    name: "Manage Prayer Requests",
    description: "Create, update, and delete prayer requests",
    roles: ["pastor", "elder", "church_admin", "church_member"],
  },
  VIEW_ANNOUNCEMENTS: {
    id: "view_announcements",
    name: "View Announcements",
    description: "View all announcements",
    roles: ["church_member", "pastor", "elder", "secretary", "church_admin"],
  },
  MANAGE_ANNOUNCEMENTS: {
    id: "manage_announcements",
    name: "Manage Announcements",
    description: "Create, update, and delete announcements",
    roles: ["elder", "secretary", "church_admin", "pastor"],
  },
  VIEW_EVENTS: {
    id: "view_events",
    name: "View Events",
    description: "View all events",
    roles: ["church_member", "pastor", "elder", "treasurer", "secretary", "church_admin"],
  },
  MANAGE_EVENTS: {
    id: "manage_events",
    name: "Manage Events",
    description: "Create, update, and delete events",
    roles: ["secretary", "church_admin", "pastor", "elder"],
  },
  VIEW_GROUPS: {
    id: "view_groups",
    name: "View Groups",
    description: "View all groups",
    roles: ["church_member", "pastor", "elder", "treasurer", "secretary", "church_admin"],
  },
  MANAGE_GROUPS: {
    id: "manage_groups",
    name: "Manage Groups",
    description: "Manage groups and members",
    roles: ["elder", "church_admin", "pastor", "secretary"],
  },
  VIEW_DOCUMENTS: {
    id: "view_documents",
    name: "View Documents",
    description: "View all documents",
    roles: ["church_member", "pastor", "elder", "treasurer", "secretary", "church_admin"],
  },
  MANAGE_DOCUMENTS: {
    id: "manage_documents",
    name: "Manage Documents",
    description: "Create, update, and delete documents",
    roles: ["secretary", "church_admin", "pastor", "elder"],
  },
  VIEW_LEADERS: {
    id: "view_leaders",
    name: "View Leaders",
    description: "View all leaders",
    roles: ["church_member", "pastor", "elder", "treasurer", "secretary", "church_admin"],
  },
  MANAGE_LEADERS: {
    id: "manage_leaders",
    name: "Manage Leaders",
    description: "Approve and manage leaders",
    roles: ["elder", "church_admin", "pastor"],
  },
  VIEW_BUDGETS: {
    id: "view_budgets",
    name: "View Budgets",
    description: "View church budgets",
    roles: ["treasurer", "church_admin", "pastor", "elder", "secretary", "church_member"],
  },
  MANAGE_BUDGETS: {
    id: "manage_budgets",
    name: "Manage Budgets",
    description: "Create, update, and delete budgets",
    roles: ["treasurer", "church_admin", "pastor", "elder", "secretary"],
  },
  VIEW_REPORTS: {
    id: "view_reports",
    name: "View Reports",
    description: "View church reports",
    roles: ["pastor", "elder", "treasurer", "secretary", "church_admin"],
  },
  VIEW_OWN_REPORTS: {
    id: "view_own_reports",
    name: "View Own Reports",
    description: "View personal reports",
    roles: ["church_member"],
  },
  VIEW_ANALYTICS: {
    id: "view_analytics",
    name: "View Analytics",
    description: "View church analytics",
    roles: ["pastor", "elder", "treasurer", "secretary", "church_admin"],
  },
  VIEW_OWN_ANALYTICS: {
    id: "view_own_analytics",
    name: "View Own Analytics",
    description: "View personal analytics",
    roles: ["church_member"],
  },
  VIEW_VISITORS: {
    id: "view_visitors",
    name: "View Visitors",
    description: "View visitor records",
    roles: ["pastor", "elder", "treasurer", "secretary", "church_admin"],
  },
  MANAGE_VISITORS: {
    id: "manage_visitors",
    name: "Manage Visitors",
    description: "Create, update, and delete visitors",
    roles: ["secretary", "church_admin", "pastor", "elder"],
  },
  CONVERT_VISITORS: {
    id: "convert_visitors",
    name: "Convert Visitors",
    description: "Convert visitors to members",
    roles: ["secretary", "church_admin", "pastor", "elder"],
  },
  MANAGE_PLEDGES: {
    id: "manage_pledges",
    name: "Manage Pledges",
    description: "Create, update, and delete pledges",
    roles: ["treasurer", "church_admin", "pastor", "elder", "secretary"],
  },
  VIEW_POSITIONS: {
    id: "view_positions",
    name: "View Positions",
    description: "View all leadership positions",
    roles: ["church_member", "pastor", "elder", "treasurer", "secretary", "church_admin"],
  },
  MANAGE_POSITIONS: {
    id: "manage_positions",
    name: "Manage Positions",
    description: "Create, update, and delete leadership positions",
    roles: ["church_admin", "pastor", "elder"],
  },
  ASSIGN_POSITIONS: {
    id: "assign_positions",
    name: "Assign Positions",
    description: "Assign members to leadership positions",
    roles: ["church_admin", "secretary", "pastor"],
  },
};

export function hasPermission(userRole: UserRole, permissionId: string): boolean {
  const permission = Object.values(PERMISSIONS).find(p => p.id === permissionId);
  if (!permission) return false;
  return permission.roles.includes(userRole);
}

export function hasAnyPermission(userRole: UserRole, permissionIds: string[]): boolean {
  return permissionIds.some(id => hasPermission(userRole, id));
}

export function hasAllPermissions(userRole: UserRole, permissionIds: string[]): boolean {
  return permissionIds.every(id => hasPermission(userRole, id));
}

export function getVisibleNavItems(userRole: UserRole, navItems: any[]): any[] {
  return navItems.filter(item => {
    if (!item.roles) return true;
    return item.roles.includes(userRole);
  });
}

export function isRoleUpgradable(currentRole: UserRole): boolean {
  const upgradableRoles: UserRole[] = ["church_member", "pastor", "elder", "treasurer", "secretary"];
  return upgradableRoles.includes(currentRole);
}

export function getAvailableUpgradeRoles(currentRole: UserRole): UserRole[] {
  const allRoles: UserRole[] = ["pastor", "elder", "treasurer", "secretary", "church_admin"];
  const currentIndex = allRoles.indexOf(currentRole);
  if (currentIndex === -1) return allRoles;
  return allRoles.slice(currentIndex + 1);
}

export function getPositionIcon(name: string): string {
  const lowerName = name.toLowerCase().trim();
  for (const [key, icon] of Object.entries(POSITION_ICONS)) {
    if (lowerName.includes(key) || key.includes(lowerName)) {
      return icon;
    }
  }
  return "📌";
}