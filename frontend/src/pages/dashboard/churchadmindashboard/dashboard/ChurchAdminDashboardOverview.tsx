import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  FiUsers,
  FiCalendar,
  FiHeart,
  FiDollarSign,
  FiBell,
  FiBook,
  FiMusic,
  FiClipboard,
  FiUserPlus,
  FiTrendingUp,
  FiBarChart2,
  FiFile,
  FiHome,
} from "react-icons/fi";
import { FaHandshake, FaUserFriends } from "react-icons/fa";
import { fetchMembers } from "../../../../Features/members/membersAPI";
import { fetchEvents } from "../../../../Features/events/eventsAPI";
import { fetchPrayerRequests } from "../../../../Features/prayer/PrayerAPI";
import { fetchGiving } from "../../../../Features/giving/givingAPI";
import { fetchAnnouncements } from "../../../../Features/announcements/announcementsAPI";
import { fetchServices } from "../../../../Features/services/servicesAPI";
import { fetchExpenses } from "../../../../Features/expenses/expensesAPI";
import { fetchPledges } from "../../../../Features/pledges/pledgesAPI";
import { fetchVisitors } from "../../../../Features/visitors/visitorsAPI";
import "./ChurchAdminDashboardOverview.css";

export default function ChurchAdminDashboardOverview() {
  const token = useSelector((state: any) => state.user.token);
  const user = useSelector((state: any) => state.user.user);
  const churchId = useSelector((state: any) => state.user.user?.churchId);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    members: 0,
    events: 0,
    prayerRequests: 0,
    givingTotal: 0,
    announcements: 0,
    services: 0,
    expensesTotal: 0,
    pledgesTotal: 0,
    visitors: 0,
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
        const [members, events, prayers, giving, announcements, services, expenses, pledges, visitors] = await Promise.all([
          fetchMembers(token),
          fetchEvents(token),
          fetchPrayerRequests(token),
          fetchGiving(token),
          fetchAnnouncements(token),
          fetchServices(token),
          fetchExpenses(token),
          fetchPledges(token),
          fetchVisitors(token),
        ]);

        const churchMembers = members.filter((m: any) => m.churchId === churchId);
        const churchEvents = events.filter((e: any) => e.churchId === churchId);
        const churchPrayers = prayers.filter((p: any) => p.churchId === churchId);
        const churchGiving = giving.filter((g: any) => g.churchId === churchId);
        const churchAnnouncements = announcements.filter((a: any) => a.churchId === churchId);
        const churchServices = services.filter((s: any) => s.churchId === churchId);
        const churchExpenses = expenses.filter((e: any) => e.churchId === churchId);
        const churchPledges = pledges.filter((p: any) => p.churchId === churchId);
        const churchVisitors = visitors.filter((v: any) => v.churchId === churchId);

        setStats({
          members: churchMembers.length,
          events: churchEvents.length,
          prayerRequests: churchPrayers.length,
          givingTotal: churchGiving.reduce((sum: number, g: any) => sum + Number(g.amount), 0),
          announcements: churchAnnouncements.length,
          services: churchServices.length,
          expensesTotal: churchExpenses.reduce((sum: number, e: any) => sum + Number(e.amount), 0),
          pledgesTotal: churchPledges.reduce((sum: number, p: any) => sum + Number(p.amount), 0),
          visitors: churchVisitors.length,
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
    return "CA";
  };

  const statCards = [
    {
      title: "Total Members",
      value: stats.members,
      icon: FiUsers,
      color: "#1565C0",
      link: "/dashboard/church-admin/members",
    },
    {
      title: "Total Events",
      value: stats.events,
      icon: FiCalendar,
      color: "#7C3AED",
      link: "/dashboard/church-admin/events",
    },
    {
      title: "Prayer Requests",
      value: stats.prayerRequests,
      icon: FiHeart,
      color: "#DC2626",
      link: "/dashboard/church-admin/prayer",
    },
    {
      title: "Total Giving",
      value: `$${stats.givingTotal.toFixed(2)}`,
      icon: FiDollarSign,
      color: "#2E7D32",
      link: "/dashboard/church-admin/giving",
    },
    {
      title: "Announcements",
      value: stats.announcements,
      icon: FiBell,
      color: "#F59E0B",
      link: "/dashboard/church-admin/announcements",
    },
    {
      title: "Services",
      value: stats.services,
      icon: FiMusic,
      color: "#8B5CF6",
      link: "/dashboard/church-admin/services",
    },
    {
      title: "Total Expenses",
      value: `$${stats.expensesTotal.toFixed(2)}`,
      icon: FiClipboard,
      color: "#EF4444",
      link: "/dashboard/church-admin/expenses",
    },
    {
      title: "Total Pledges",
      value: `$${stats.pledgesTotal.toFixed(2)}`,
      icon: FaHandshake,
      color: "#059669",
      link: "/dashboard/church-admin/pledges",
    },
    {
      title: "Visitors",
      value: stats.visitors,
      icon: FaUserFriends,
      color: "#7C3AED",
      link: "/dashboard/church-admin/visitors",
    },
  ];

  const quickActions = [
    { label: "Add Member", icon: FiUserPlus, link: "/dashboard/church-admin/members" },
    { label: "Create Event", icon: FiCalendar, link: "/dashboard/church-admin/events" },
    { label: "Add Announcement", icon: FiBell, link: "/dashboard/church-admin/announcements" },
    { label: "Record Giving", icon: FiDollarSign, link: "/dashboard/church-admin/giving" },
    { label: "Add Expense", icon: FiClipboard, link: "/dashboard/church-admin/expenses" },
    { label: "Create Pledge", icon: FaHandshake, link: "/dashboard/church-admin/pledges" },
    { label: "View Reports", icon: FiBarChart2, link: "/dashboard/church-admin/reports" },
    { label: "Analytics", icon: FiTrendingUp, link: "/dashboard/church-admin/analytics" },
    { label: "Documents", icon: FiFile, link: "/dashboard/church-admin/documents" },
  ];

  if (loading) {
    return (
      <div className="admin-dashboard-loading">
        <div className="admin-dashboard-loading-spinner"></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="admin-dashboard-overview">
      <div className="admin-dashboard-welcome">
        <div className="admin-dashboard-welcome-content">
          <div className="admin-dashboard-welcome-text">
            <span className="admin-dashboard-greeting">{greeting},</span>
            <h1 className="admin-dashboard-welcome-name">{user?.fullName || "Admin"}</h1>
            <p className="admin-dashboard-welcome-role">Church Administrator</p>
          </div>
          <div className="admin-dashboard-welcome-avatar">
            <div className="admin-dashboard-welcome-avatar-circle">
              {getInitials()}
            </div>
          </div>
        </div>
      </div>

      <div className="admin-dashboard-stats-grid">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <a
              key={index}
              href={stat.link}
              className="admin-dashboard-stat-card"
            >
              <div className="admin-dashboard-stat-card-icon" style={{ background: `${stat.color}15`, color: stat.color }}>
                <Icon size={24} />
              </div>
              <div className="admin-dashboard-stat-card-content">
                <h3 className="admin-dashboard-stat-card-title">{stat.title}</h3>
                <p className="admin-dashboard-stat-card-value">{stat.value}</p>
              </div>
            </a>
          );
        })}
      </div>

      <div className="admin-dashboard-quick-actions">
        <h3 className="admin-dashboard-quick-actions-title">Quick Actions</h3>
        <div className="admin-dashboard-quick-actions-grid">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <a
                key={index}
                href={action.link}
                className="admin-dashboard-quick-action"
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