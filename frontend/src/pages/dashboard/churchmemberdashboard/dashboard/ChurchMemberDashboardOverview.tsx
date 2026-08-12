import { useState, useEffect, type ReactNode } from "react";
import type { IconBaseProps } from "react-icons";
import { useSelector } from "react-redux";
import {
  FiCalendar,
  FiHeart,
  FiUsers,
  FiDollarSign,
  FiUser,
  FiBell,
  FiBook,
  FiCheckSquare,
  FiAward,
  FiMusic,
  FiClipboard,
  FiTrendingUp,
  FiBarChart2,
  FiFile,
  FiBriefcase,
  FiUserPlus,
} from "react-icons/fi";
import { fetchEvents } from "../../../../Features/events/eventsAPI";
import { fetchPrayerRequests } from "../../../../Features/prayer/PrayerAPI";
import { fetchGroups } from "../../../../Features/groups/groupsAPI";
import { fetchAttendanceByMember } from "../../../../Features/attendance/attendanceAPI";
import { fetchGivingByMember } from "../../../../Features/giving/givingAPI";
import { fetchAnnouncements } from "../../../../Features/announcements/announcementsAPI";
import { fetchServices } from "../../../../Features/services/servicesAPI";
import { fetchExpenses } from "../../../../Features/expenses/expensesAPI";
import { fetchSermons } from "../../../../Features/sermons/sermonsAPI";
import { fetchMembers } from "../../../../Features/members/membersAPI";
import { fetchPledgesByMember } from "../../../../Features/pledges/pledgesAPI";
import { fetchVisitors } from "../../../../Features/visitors/visitorsAPI";
import { fetchPositions } from "../../../../Features/positions/positionsAPI";
import { ROLE_DISPLAY_NAMES } from "../../../../utils/permissions";
import "./ChurchMemberDashboardOverview.css";

export default function ChurchMemberDashboardOverview() {
  const token = useSelector((state: any) => state.user.token);
  const user = useSelector((state: any) => state.user.user);
  const churchId = useSelector((state: any) => state.user.user?.churchId);
  const userRole = useSelector((state: any) => state.user.user?.role);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    eventsRegistered: 0,
    prayerRequests: 0,
    groupsJoined: 0,
    attendanceCount: 0,
    givingTotal: 0,
    announcementsUnread: 0,
    servicesCount: 0,
    expensesCount: 0,
    sermonsCount: 0,
    membersCount: 0,
    pledgesCount: 0,
    visitorsCount: 0,
    positionsCount: 0,
  });
  const [greeting, setGreeting] = useState("");

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good Morning");
    else if (hour < 17) setGreeting("Good Afternoon");
    else setGreeting("Good Evening");
  }, []);

  useEffect(() => {
    const loadData = async () => {
      if (!token || !user) return;
      try {
        setLoading(true);
        const [
          events, prayers, groups, attendance, giving, announcements, 
          services, expenses, sermons, members, pledges, visitors, positions
        ] = await Promise.all([
          fetchEvents(token),
          fetchPrayerRequests(token),
          fetchGroups(token),
          fetchAttendanceByMember(user.userId, token),
          fetchGivingByMember(user.userId, token),
          fetchAnnouncements(token),
          fetchServices(token),
          fetchExpenses(token),
          fetchSermons(token),
          fetchMembers(token),
          fetchPledgesByMember(user.userId, token).catch(() => []),
          fetchVisitors(token).catch(() => []),
          fetchPositions(token).catch(() => []),
        ]);

        const churchEvents = events.filter((e: any) => e.churchId === churchId);
        const churchPrayers = prayers.filter((p: any) => p.churchId === churchId);
        const churchGroups = groups.filter((g: any) => g.churchId === churchId);
        const churchAttendance = attendance.filter((a: any) => a.churchId === churchId);
        const churchGiving = giving.filter((g: any) => g.churchId === churchId);
        const churchAnnouncements = announcements.filter((a: any) => a.churchId === churchId);
        const churchServices = services.filter((s: any) => s.churchId === churchId);
        const churchExpenses = expenses.filter((e: any) => e.churchId === churchId);
        const churchSermons = sermons.filter((s: any) => s.churchId === churchId);
        const churchMembers = members.filter((m: any) => m.churchId === churchId);
        const churchPledges = pledges.filter((p: any) => p.churchId === churchId);
        const churchVisitors = visitors.filter((v: any) => v.churchId === churchId);
        const churchPositions = positions.filter((p: any) => p.churchId === churchId);

        setStats({
          eventsRegistered: churchEvents.length,
          prayerRequests: churchPrayers.length,
          groupsJoined: churchGroups.length,
          attendanceCount: churchAttendance.length,
          givingTotal: churchGiving.reduce((sum: number, g: any) => sum + Number(g.amount), 0),
          announcementsUnread: churchAnnouncements.filter((a: any) => !a.isRead).length,
          servicesCount: churchServices.length,
          expensesCount: churchExpenses.length,
          sermonsCount: churchSermons.length,
          membersCount: churchMembers.length,
          pledgesCount: churchPledges.length,
          visitorsCount: churchVisitors.length,
          positionsCount: churchPositions.length,
        });
      } catch (error) {
        console.error("Failed to load dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [token, user, churchId]);

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

  const getRoleSpecificStats = () => {
    const baseStats = [
      {
        title: "Events Registered",
        value: stats.eventsRegistered,
        icon: FiCalendar,
        color: "#1565C0",
      },
      {
        title: "Prayer Requests",
        value: stats.prayerRequests,
        icon: FiHeart,
        color: "#DC2626",
      },
      {
        title: "Groups Joined",
        value: stats.groupsJoined,
        icon: FiUsers,
        color: "#7C3AED",
      },
      {
        title: "Attendance Records",
        value: stats.attendanceCount,
        icon: FiCheckSquare,
        color: "#16A34A",
      },
      {
        title: "Total Giving",
        value: `$${stats.givingTotal.toFixed(2)}`,
        icon: FiDollarSign,
        color: "#2E7D32",
      },
      {
        title: "Unread Announcements",
        value: stats.announcementsUnread,
        icon: FiBell,
        color: "#F59E0B",
      },
    ];

    if (userRole === "pastor" || userRole === "church_admin" || userRole === "secretary") {
      baseStats.push({
        title: "Services",
        value: stats.servicesCount,
        icon: FiMusic,
        color: "#7C3AED",
      });
    }

    if (userRole === "pastor" || userRole === "elder" || userRole === "church_admin") {
      baseStats.push({
        title: "Sermons",
        value: stats.sermonsCount,
        icon: FiBook,
        color: "#8B5CF6",
      });
    }

    if (userRole === "treasurer" || userRole === "church_admin") {
      baseStats.push({
        title: "Expenses",
        value: stats.expensesCount,
        icon: FiClipboard,
        color: "#DC2626",
      });
    }

    if (userRole === "treasurer" || userRole === "church_admin" || userRole === "pastor" || userRole === "elder" || userRole === "secretary") {
      baseStats.push({
        title: "Pledges",
        value: stats.pledgesCount,
        icon: FiHandshake,
        color: "#059669",
      });
    }

    if (userRole === "secretary" || userRole === "church_admin" || userRole === "pastor" || userRole === "elder") {
      baseStats.push({
        title: "Visitors",
        value: stats.visitorsCount,
        icon: FiUserPlus,
        color: "#7C3AED",
      });
    }

    if (userRole === "church_admin" || userRole === "pastor" || userRole === "elder") {
      baseStats.push({
        title: "Positions",
        value: stats.positionsCount,
        icon: FiBriefcase,
        color: "#1565C0",
      });
    }

    return baseStats;
  };

  const getQuickActions = () => {
    const baseActions = [
      { label: "My Profile", icon: FiUser, link: "/dashboard/member/profile" },
      { label: "My Giving", icon: FiDollarSign, link: "/dashboard/member/giving" },
      { label: "Prayer Request", icon: FiHeart, link: "/dashboard/member/prayer" },
      { label: "Mark Attendance", icon: FiCheckSquare, link: "/dashboard/member/attendance" },
      { label: "My Leadership", icon: FiAward, link: "/dashboard/member/leadership" },
      { label: "Sermons", icon: FiBook, link: "/dashboard/member/sermons" },
    ];

    if (userRole === "pastor" || userRole === "church_admin" || userRole === "secretary") {
      baseActions.push({ label: "Services", icon: FiMusic, link: "/dashboard/member/services" });
    }

    if (userRole === "treasurer" || userRole === "church_admin") {
      baseActions.push({ label: "Expenses", icon: FiClipboard, link: "/dashboard/member/expenses" });
    }

    if (userRole === "elder" || userRole === "church_admin") {
      baseActions.push({ label: "Manage Groups", icon: FiUsers, link: "/dashboard/member/groups" });
    }

    if (userRole === "secretary" || userRole === "church_admin") {
      baseActions.push({ label: "Manage Documents", icon: FiFile, link: "/dashboard/member/documents" });
    }

    if (userRole === "pastor" || userRole === "elder" || userRole === "treasurer" || userRole === "secretary" || userRole === "church_admin") {
      baseActions.push({ label: "View Reports", icon: FiBarChart2, link: "/dashboard/member/reports" });
      baseActions.push({ label: "Analytics", icon: FiTrendingUp, link: "/dashboard/member/analytics" });
    }

    if (userRole === "pastor" || userRole === "elder" || userRole === "church_admin") {
      baseActions.push({ label: "Leadership Positions", icon: FiBriefcase, link: "/dashboard/member/positions" });
    }

    if (userRole === "treasurer" || userRole === "church_admin") {
      baseActions.push({ label: "My Pledges", icon: FiHandshake, link: "/dashboard/member/pledges" });
    }

    return baseActions;
  };

  if (loading) {
    return (
      <div className="member-dashboard-loading">
        <div className="member-dashboard-loading-spinner"></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="member-dashboard-overview">
      <div className="member-dashboard-welcome">
        <div className="member-dashboard-welcome-content">
          <div className="member-dashboard-welcome-text">
            <span className="member-dashboard-greeting">{greeting},</span>
            <h1 className="member-dashboard-welcome-name">{user?.fullName || "Member"}</h1>
            <p className="member-dashboard-welcome-role">{displayRole}</p>
          </div>
          <div className="member-dashboard-welcome-avatar">
            <div className="member-dashboard-welcome-avatar-circle">
              {getInitials()}
            </div>
          </div>
        </div>
      </div>

      <div className="member-dashboard-stats-grid">
        {getRoleSpecificStats().map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="member-dashboard-stat-card">
              <div className="member-dashboard-stat-card-icon" style={{ background: `${stat.color}15`, color: stat.color }}>
                <Icon size={24} />
              </div>
              <div className="member-dashboard-stat-card-content">
                <h3 className="member-dashboard-stat-card-title">{stat.title}</h3>
                <p className="member-dashboard-stat-card-value">{stat.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="member-dashboard-quick-actions">
        <h3 className="member-dashboard-quick-actions-title">Quick Actions</h3>
        <div className="member-dashboard-quick-actions-grid">
          {getQuickActions().map((action, index) => {
            const Icon = action.icon;
            return (
              <a
                key={index}
                href={action.link}
                className="member-dashboard-quick-action"
              >
                <Icon size={20} />
                <span>{action.label}</span>
              </a>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function FiHandshake(props: IconBaseProps): ReactNode {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M2 13l4-4 4 4 6-6 4 4" />
      <path d="M6 13l-2 2v3h3l2-2" />
      <path d="M14 7l2 2 3-3 1 1-4 4" />
      <path d="M10 17l4-4" />
      <path d="M18 15l3 3" />
    </svg>
  );
}
