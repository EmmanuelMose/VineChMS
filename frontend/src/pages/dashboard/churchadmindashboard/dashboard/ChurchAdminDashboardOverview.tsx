import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { 
  FiUsers, 
  FiUserCheck, 
  FiDollarSign, 
  FiCalendar, 
  FiTrendingUp, 
  FiHeart,
  FiBell,
  FiBarChart2,
  FiChevronRight,
  FiUserPlus,
  FiPlus,
  FiMapPin,
  FiGlobe,
  FiAward,
  FiStar} from "react-icons/fi";
import { 
  fetchMembers, 
  type Member 
} from "../../../../Features/members/membersAPI";
import { 
  fetchGivingTotal,
  fetchGivingSummary,
  type GivingSummary 
} from "../../../../Features/giving/givingAPI";
import { 
  fetchLeadersSummary,
  fetchLeaders,
  type Leader 
} from "../../../../Features/leaders/leadersAPI";
import { 
  fetchPrayerRequests,
  type PrayerRequest 
} from "../../../../Features/prayer/PrayerAPI";
import { 
  fetchEvents,
  type Event 
} from "../../../../Features/events/eventsAPI";
import { 
  fetchChurches,
  type Church 
} from "../../../../Features/churches/churchesAPI";
import "./ChurchAdminDashboardOverview.css";

interface DashboardStats {
  totalMembers: number;
  activeMembers: number;
  inactiveMembers: number;
  newMembersThisMonth: number;
  totalGiving: string;
  givingThisMonth: string;
  givingGrowth: number;
  attendanceRate: number;
  attendanceThisWeek: number;
  totalLeaders: number;
  pendingLeaders: number;
  activeLeaders: number;
  totalPrayerRequests: number;
  answeredPrayers: number;
  totalEvents: number;
  upcomingEvents: number;
  memberGrowthRate: number;
}

export default function ChurchAdminDashboardOverview() {
  const token = useSelector((state: any) => state.user.token);
  const churchId = useSelector((state: any) => state.user.user?.churchId);
  const user = useSelector((state: any) => state.user.user);
  
  const [church, setChurch] = useState<Church | null>(null);
  const [stats, setStats] = useState<DashboardStats>({
    totalMembers: 0,
    activeMembers: 0,
    inactiveMembers: 0,
    newMembersThisMonth: 0,
    totalGiving: "0",
    givingThisMonth: "0",
    givingGrowth: 0,
    attendanceRate: 0,
    attendanceThisWeek: 0,
    totalLeaders: 0,
    pendingLeaders: 0,
    activeLeaders: 0,
    totalPrayerRequests: 0,
    answeredPrayers: 0,
    totalEvents: 0,
    upcomingEvents: 0,
    memberGrowthRate: 0,
  });
  const [recentMembers, setRecentMembers] = useState<Member[]>([]);
  const [recentLeaders, setRecentLeaders] = useState<Leader[]>([]);
  const [recentPrayerRequests, setRecentPrayerRequests] = useState<PrayerRequest[]>([]);
  const [upcomingEventsList, setUpcomingEventsList] = useState<Event[]>([]);
  const [givingSummary, setGivingSummary] = useState<GivingSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [greeting, setGreeting] = useState("");

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good Morning");
    else if (hour < 17) setGreeting("Good Afternoon");
    else setGreeting("Good Evening");
  }, []);

  useEffect(() => {
    const loadDashboardData = async () => {
      if (!token || !churchId) return;

      try {
        setLoading(true);

        const [
          members,
          leaders,
          leadersSummary,
          givingTotal,
          givingSummaryData,
          prayerRequests,
          events,
          churchData
        ] = await Promise.all([
          fetchMembers(token),
          fetchLeaders(token),
          fetchLeadersSummary(token),
          fetchGivingTotal(churchId, token),
          fetchGivingSummary(churchId, token),
          fetchPrayerRequests(token),
          fetchEvents(token),
          fetchChurches(token),
        ]);

        const activeMembers = members.filter((m) => m.isActive).length;
        const inactiveMembers = members.filter((m) => !m.isActive).length;
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();
        const newMembersThisMonth = members.filter((m) => {
          const date = new Date(m.createdAt);
          return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
        }).length;

        const pendingLeaders = leaders.filter((l) => !l.isApproved && l.isActive).length;
        const activeLeaders = leaders.filter((l) => l.isActive).length;

        const answeredPrayers = prayerRequests.filter((p) => p.status === "answered").length;
        const upcomingEvents = events.filter((e) => new Date(e.startDate) > new Date()).length;

        const memberGrowthRate = members.length > 0 ? Math.round((newMembersThisMonth / members.length) * 100) : 0;

        const churchInfo = churchData.find((c) => c.churchId === churchId);

        setChurch(churchInfo || null);
        setStats({
          totalMembers: members.length,
          activeMembers,
          inactiveMembers,
          newMembersThisMonth,
          totalGiving: givingTotal.total || "0",
          givingThisMonth: "0",
          givingGrowth: 12,
          attendanceRate: 78,
          attendanceThisWeek: 45,
          totalLeaders: leadersSummary.total || 0,
          pendingLeaders,
          activeLeaders,
          totalPrayerRequests: prayerRequests.length,
          answeredPrayers,
          totalEvents: events.length,
          upcomingEvents,
          memberGrowthRate,
        });

        setRecentMembers(members.slice(0, 5));
        setRecentLeaders(leaders.slice(0, 5));
        setRecentPrayerRequests(prayerRequests.filter(p => p.status === "pending").slice(0, 5));
        setUpcomingEventsList(events.filter(e => new Date(e.startDate) > new Date()).slice(0, 5));
        setGivingSummary(givingSummaryData);

      } catch (error) {
        console.error("Failed to load dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, [token, churchId]);

  const formatCurrency = (amount: string) => {
    const num = parseFloat(amount);
    if (isNaN(num)) return "$0";
    return "$" + num.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
  };

  const statCards = [
    {
      title: "Total Members",
      value: stats.totalMembers,
      subtitle: `${stats.activeMembers} active · ${stats.inactiveMembers} inactive`,
      icon: FiUsers,
      color: "blue",
      trend: stats.memberGrowthRate,
      detail: `${stats.newMembersThisMonth} new this month`,
    },
    {
      title: "Total Giving",
      value: formatCurrency(stats.totalGiving),
      subtitle: `${formatCurrency(stats.givingThisMonth)} this month`,
      icon: FiDollarSign,
      color: "green",
      trend: stats.givingGrowth,
      detail: `${givingSummary.length} giving categories`,
    },
    {
      title: "Attendance Rate",
      value: `${stats.attendanceRate}%`,
      subtitle: `${stats.attendanceThisWeek} attended this week`,
      icon: FiCalendar,
      color: "yellow",
      trend: 5,
      detail: "Average attendance",
    },
    {
      title: "Leadership",
      value: stats.totalLeaders,
      subtitle: `${stats.activeLeaders} active · ${stats.pendingLeaders} pending`,
      icon: FiUserCheck,
      color: "purple",
      trend: 0,
      detail: "Church leadership team",
    },
  ];

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="dashboard-loading-spinner"></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-overview">
      <div className="dashboard-welcome">
        <div className="dashboard-welcome-content">
          <div className="dashboard-welcome-text">
            <span className="dashboard-greeting">{greeting},</span>
            <h1 className="dashboard-welcome-name">{user?.fullName || "Admin"}</h1>
            <p className="dashboard-welcome-role">Church Administrator</p>
          </div>
          <div className="dashboard-welcome-church">
            <FiGlobe className="dashboard-church-icon" />
            <div>
              <h3 className="dashboard-church-name">{church?.name || "My Church"}</h3>
              <p className="dashboard-church-location">
                <FiMapPin size={14} />
                {church?.city || "N/A"}, {church?.country || "N/A"}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="dashboard-stats-grid">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className={`dashboard-stat-card stat-color-${stat.color}`}>
              <div className="dashboard-stat-card-icon">
                <Icon size={24} />
              </div>
              <div className="dashboard-stat-card-content">
                <h3 className="dashboard-stat-card-title">{stat.title}</h3>
                <p className="dashboard-stat-card-value">{stat.value}</p>
                <p className="dashboard-stat-card-subtitle">{stat.subtitle}</p>
                <p className="dashboard-stat-card-detail">{stat.detail}</p>
              </div>
              {stat.trend > 0 && (
                <div className="dashboard-stat-card-trend trend-up">
                  <FiTrendingUp size={14} />
                  {stat.trend}%
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-card dashboard-card-large">
          <div className="dashboard-card-header">
            <h3 className="dashboard-card-title">
              <FiUsers size={18} />
              Recent Members
            </h3>
            <button 
              className="dashboard-card-action"
              onClick={() => window.location.href = '/dashboard/church-admin/members'}
            >
              View All <FiChevronRight size={14} />
            </button>
          </div>
          <div className="dashboard-activity-list">
            {recentMembers.map((member) => (
              <div key={member.memberId} className="dashboard-activity-item">
                <div className="dashboard-activity-avatar">
                  {member.fullName.charAt(0).toUpperCase()}
                </div>
                <div className="dashboard-activity-content">
                  <p className="dashboard-activity-text">{member.fullName}</p>
                  <span className="dashboard-activity-email">{member.email}</span>
                </div>
                <span className={`dashboard-activity-status ${member.isActive ? "status-active" : "status-inactive"}`}>
                  {member.isActive ? "Active" : "Inactive"}
                </span>
                <span className="dashboard-activity-role">{member.role.replace("_", " ")}</span>
              </div>
            ))}
            {recentMembers.length === 0 && (
              <p className="dashboard-empty-text">No members found</p>
            )}
          </div>
        </div>

        <div className="dashboard-card">
          <div className="dashboard-card-header">
            <h3 className="dashboard-card-title">
              <FiStar size={18} />
              Quick Actions
            </h3>
          </div>
          <div className="dashboard-quick-actions">
            <button 
              className="dashboard-quick-action"
              onClick={() => window.location.href = '/dashboard/church-admin/members'}
            >
              <FiUserPlus size={18} />
              Add Member
            </button>
            <button 
              className="dashboard-quick-action"
              onClick={() => window.location.href = '/dashboard/church-admin/leaders'}
            >
              <FiUserCheck size={18} />
              Add Leader
            </button>
            <button className="dashboard-quick-action">
              <FiPlus size={18} />
              Create Event
            </button>
            <button className="dashboard-quick-action">
              <FiDollarSign size={18} />
              Record Giving
            </button>
            <button className="dashboard-quick-action">
              <FiHeart size={18} />
              Prayer Request
            </button>
            <button className="dashboard-quick-action">
              <FiBell size={18} />
              Announcement
            </button>
          </div>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-card">
          <div className="dashboard-card-header">
            <h3 className="dashboard-card-title">
              <FiUserCheck size={18} />
              Pending Leaders
            </h3>
            <button 
              className="dashboard-card-action"
              onClick={() => window.location.href = '/dashboard/church-admin/leaders'}
            >
              View All <FiChevronRight size={14} />
            </button>
          </div>
          <div className="dashboard-activity-list">
            {recentLeaders.filter(l => !l.isApproved && l.isActive).map((leader) => (
              <div key={leader.leaderId} className="dashboard-activity-item">
                <div className="dashboard-activity-avatar">
                  {(leader.fullName || "U").charAt(0).toUpperCase()}
                </div>
                <div className="dashboard-activity-content">
                  <p className="dashboard-activity-text">{leader.fullName || "Unknown"}</p>
                  <span className="dashboard-activity-email">{leader.email || "No email"}</span>
                </div>
                <span className="dashboard-activity-status status-pending">Pending</span>
                <span className="dashboard-activity-role">{leader.positionName || "Leader"}</span>
              </div>
            ))}
            {recentLeaders.filter(l => !l.isApproved && l.isActive).length === 0 && (
              <p className="dashboard-empty-text">No pending leaders</p>
            )}
          </div>
        </div>

        <div className="dashboard-card">
          <div className="dashboard-card-header">
            <h3 className="dashboard-card-title">
              <FiHeart size={18} />
              Prayer Requests
            </h3>
            <button 
              className="dashboard-card-action"
              onClick={() => window.location.href = '/dashboard/church-admin/prayer'}
            >
              View All <FiChevronRight size={14} />
            </button>
          </div>
          <div className="dashboard-activity-list">
            {recentPrayerRequests.map((prayer) => (
              <div key={prayer.prayerRequestId} className="dashboard-activity-item">
                <div className="dashboard-activity-avatar prayer-avatar">
                  <FiHeart size={14} />
                </div>
                <div className="dashboard-activity-content">
                  <p className="dashboard-activity-text">{prayer.title}</p>
                  <span className="dashboard-activity-email">{prayer.fullName || "Anonymous"}</span>
                </div>
                <span className={`dashboard-activity-status status-${prayer.status}`}>
                  {prayer.status}
                </span>
              </div>
            ))}
            {recentPrayerRequests.length === 0 && (
              <p className="dashboard-empty-text">No prayer requests</p>
            )}
          </div>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-card">
          <div className="dashboard-card-header">
            <h3 className="dashboard-card-title">
              <FiCalendar size={18} />
              Upcoming Events
            </h3>
            <button 
              className="dashboard-card-action"
              onClick={() => window.location.href = '/dashboard/church-admin/events'}
            >
              View All <FiChevronRight size={14} />
            </button>
          </div>
          <div className="dashboard-activity-list">
            {upcomingEventsList.map((event) => (
              <div key={event.eventId} className="dashboard-activity-item">
                <div className="dashboard-activity-avatar event-avatar">
                  <FiCalendar size={14} />
                </div>
                <div className="dashboard-activity-content">
                  <p className="dashboard-activity-text">{event.title}</p>
                  <span className="dashboard-activity-email">
                    {new Date(event.startDate).toLocaleDateString()} · {event.location || "No location"}
                  </span>
                </div>
                <span className={`dashboard-activity-status status-${event.status}`}>
                  {event.status}
                </span>
              </div>
            ))}
            {upcomingEventsList.length === 0 && (
              <p className="dashboard-empty-text">No upcoming events</p>
            )}
          </div>
        </div>

        <div className="dashboard-card">
          <div className="dashboard-card-header">
            <h3 className="dashboard-card-title">
              <FiBarChart2 size={18} />
              Church Overview
            </h3>
          </div>
          <div className="dashboard-overview-stats">
            <div className="dashboard-overview-stat">
              <span className="dashboard-overview-stat-label">Total Members</span>
              <span className="dashboard-overview-stat-value">{stats.totalMembers}</span>
            </div>
            <div className="dashboard-overview-stat">
              <span className="dashboard-overview-stat-label">Active Members</span>
              <span className="dashboard-overview-stat-value">{stats.activeMembers}</span>
            </div>
            <div className="dashboard-overview-stat">
              <span className="dashboard-overview-stat-label">Leaders</span>
              <span className="dashboard-overview-stat-value">{stats.totalLeaders}</span>
            </div>
            <div className="dashboard-overview-stat">
              <span className="dashboard-overview-stat-label">Events</span>
              <span className="dashboard-overview-stat-value">{stats.totalEvents}</span>
            </div>
            <div className="dashboard-overview-stat">
              <span className="dashboard-overview-stat-label">Prayer Requests</span>
              <span className="dashboard-overview-stat-value">{stats.totalPrayerRequests}</span>
            </div>
            <div className="dashboard-overview-stat">
              <span className="dashboard-overview-stat-label">Answered Prayers</span>
              <span className="dashboard-overview-stat-value">{stats.answeredPrayers}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="dashboard-card dashboard-card-full">
        <div className="dashboard-card-header">
          <h3 className="dashboard-card-title">
            <FiAward size={18} />
            Quick Stats
          </h3>
        </div>
        <div className="dashboard-quick-stats">
          <div className="dashboard-quick-stat">
            <span className="dashboard-quick-stat-value">{stats.newMembersThisMonth}</span>
            <span className="dashboard-quick-stat-label">New Members This Month</span>
          </div>
          <div className="dashboard-quick-stat">
            <span className="dashboard-quick-stat-value">{stats.upcomingEvents}</span>
            <span className="dashboard-quick-stat-label">Upcoming Events</span>
          </div>
          <div className="dashboard-quick-stat">
            <span className="dashboard-quick-stat-value">{stats.pendingLeaders}</span>
            <span className="dashboard-quick-stat-label">Pending Leaders</span>
          </div>
          <div className="dashboard-quick-stat">
            <span className="dashboard-quick-stat-value">{formatCurrency(stats.totalGiving)}</span>
            <span className="dashboard-quick-stat-label">Total Giving</span>
          </div>
          <div className="dashboard-quick-stat">
            <span className="dashboard-quick-stat-value">{stats.attendanceRate}%</span>
            <span className="dashboard-quick-stat-label">Attendance Rate</span>
          </div>
          <div className="dashboard-quick-stat">
            <span className="dashboard-quick-stat-value">{stats.answeredPrayers}</span>
            <span className="dashboard-quick-stat-label">Answered Prayers</span>
          </div>
        </div>
      </div>
    </div>
  );
}