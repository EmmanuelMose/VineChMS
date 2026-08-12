import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from "recharts";
import { FiCalendar, FiDollarSign, FiUsers, FiTrendingUp, FiPieChart, FiBarChart2, FiRefreshCw, FiBook } from "react-icons/fi";
import { fetchGivingByMember } from "../../../../Features/giving/givingAPI";
import { fetchAttendanceByMember } from "../../../../Features/attendance/attendanceAPI";
import { fetchMemberByUserId } from "../../../../Features/members/membersAPI";
import { fetchPrayerRequests } from "../../../../Features/prayer/PrayerAPI";
import { fetchGroups } from "../../../../Features/groups/groupsAPI";
import { fetchMemberEventRegistrations } from "../../../../Features/events/eventsAPI";
import { fetchServices } from "../../../../Features/services/servicesAPI";
import "./Analytics.css";

const COLORS = ['#1565C0', '#2E7D32', '#FFC107', '#DC2626', '#7C3AED', '#EC4899', '#F59E0B', '#06B6D4', '#8B5CF6', '#EF4444'];

interface AnalyticsData {
  giving: {
    total: number;
    byType: Record<string, number>;
    byCategory: Record<string, number>;
    monthly: Record<string, number>;
  };
  attendance: {
    total: number;
    present: number;
    absent: number;
    rate: number;
    monthly: Record<string, { present: number; total: number }>;
  };
  prayerRequests: {
    total: number;
    byStatus: Record<string, number>;
  };
  groups: {
    total: number;
    active: number;
  };
  events: {
    total: number;
    registered: number;
    attended: number;
  };
  services: {
    total: number;
    attended: number;
    monthly: Record<string, number>;
  };
}

export default function Analytics() {
  const token = useSelector((state: any) => state.user.token);
  const churchId = useSelector((state: any) => state.user.user?.churchId);
  const userId = useSelector((state: any) => state.user.user?.userId);

  const [memberId, setMemberId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<AnalyticsData>({
    giving: { total: 0, byType: {}, byCategory: {}, monthly: {} },
    attendance: { total: 0, present: 0, absent: 0, rate: 0, monthly: {} },
    prayerRequests: { total: 0, byStatus: {} },
    groups: { total: 0, active: 0 },
    events: { total: 0, registered: 0, attended: 0 },
    services: { total: 0, attended: 0, monthly: {} },
  });
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().setMonth(new Date().getMonth() - 6)).toISOString().split("T")[0],
    endDate: new Date().toISOString().split("T")[0],
  });

  useEffect(() => {
    const loadMemberId = async () => {
      if (token && userId) {
        try {
          const member = await fetchMemberByUserId(userId, token);
          if (member && member.memberId) {
            setMemberId(member.memberId);
          }
        } catch (error) {
          console.error("Failed to load member ID:", error);
        }
      }
    };
    loadMemberId();
  }, [token, userId]);

  useEffect(() => {
    if (memberId) {
      loadData();
    }
  }, [memberId, dateRange]);

  const loadData = async () => {
    if (!memberId || !token) return;
    try {
      setLoading(true);
      const [givingData, attendanceData, prayersData, groupsData, eventRegistrations, servicesData] = await Promise.all([
        fetchGivingByMember(memberId, token).catch(() => []),
        fetchAttendanceByMember(memberId, token).catch(() => []),
        fetchPrayerRequests(token).catch(() => []),
        fetchGroups(token).catch(() => []),
        fetchMemberEventRegistrations(memberId, token).catch(() => []),
        fetchServices(token).catch(() => []),
      ]);

      const churchPrayers = prayersData.filter((p) => p.churchId === churchId);
      const churchGroups = groupsData.filter((g) => g.churchId === churchId);
      const churchServices = servicesData.filter((s) => s.churchId === churchId);

      const byType: Record<string, number> = {};
      const byCategory: Record<string, number> = {};
      const monthlyGiving: Record<string, number> = {};
      let totalGiving = 0;

      givingData.forEach((g) => {
        totalGiving += parseFloat(g.amount);
        byType[g.type] = (byType[g.type] || 0) + parseFloat(g.amount);
        const catName = g.categoryName || "Uncategorized";
        byCategory[catName] = (byCategory[catName] || 0) + parseFloat(g.amount);
        const month = new Date(g.date).toISOString().slice(0, 7);
        monthlyGiving[month] = (monthlyGiving[month] || 0) + parseFloat(g.amount);
      });

      const present = attendanceData.filter((a) => a.attended).length;
      const absent = attendanceData.filter((a) => !a.attended).length;
      const rate = attendanceData.length > 0 ? Math.round((present / attendanceData.length) * 100) : 0;

      const monthlyAttendance: Record<string, { present: number; total: number }> = {};
      attendanceData.forEach((a) => {
        const month = new Date(a.date).toISOString().slice(0, 7);
        if (!monthlyAttendance[month]) monthlyAttendance[month] = { present: 0, total: 0 };
        monthlyAttendance[month].total += 1;
        if (a.attended) monthlyAttendance[month].present += 1;
      });

      const prayerByStatus: Record<string, number> = {};
      churchPrayers.forEach((p) => {
        prayerByStatus[p.status] = (prayerByStatus[p.status] || 0) + 1;
      });

      const registeredEvents = eventRegistrations.length;
      const attendedEvents = eventRegistrations.filter((r) => r.attended).length;

      const monthlyServices: Record<string, number> = {};
      let totalServicesAttended = 0;
      attendanceData.forEach((a) => {
        if (a.attended) {
          totalServicesAttended += 1;
          const month = new Date(a.date).toISOString().slice(0, 7);
          monthlyServices[month] = (monthlyServices[month] || 0) + 1;
        }
      });

      setData({
        giving: {
          total: totalGiving,
          byType,
          byCategory,
          monthly: monthlyGiving,
        },
        attendance: {
          total: attendanceData.length,
          present,
          absent,
          rate,
          monthly: monthlyAttendance,
        },
        prayerRequests: {
          total: churchPrayers.length,
          byStatus: prayerByStatus,
        },
        groups: {
          total: churchGroups.length,
          active: churchGroups.filter((g) => g.isActive).length,
        },
        events: {
          total: churchServices.length,
          registered: registeredEvents,
          attended: attendedEvents,
        },
        services: {
          total: attendanceData.length,
          attended: totalServicesAttended,
          monthly: monthlyServices,
        },
      });
    } catch (error) {
      console.error("Failed to load analytics data:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => `$${amount.toFixed(2)}`;

  const getGivingByTypeData = () => {
    return Object.entries(data.giving.byType).map(([name, value]) => ({ name, value }));
  };

  const getGivingMonthlyData = () => {
    return Object.entries(data.giving.monthly)
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([month, value]) => ({ month, value }));
  };

  const getAttendanceMonthlyData = () => {
    return Object.entries(data.attendance.monthly)
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([month, values]) => ({
        month,
        present: values.present,
        total: values.total,
        rate: values.total > 0 ? Math.round((values.present / values.total) * 100) : 0,
      }));
  };

  const getPrayerByStatusData = () => {
    return Object.entries(data.prayerRequests.byStatus).map(([name, value]) => ({ name, value }));
  };

  const getServicesMonthlyData = () => {
    return Object.entries(data.services.monthly)
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([month, value]) => ({ month, value }));
  };

  const summaryCards = [
    {
      title: "Total Giving",
      value: formatCurrency(data.giving.total),
      icon: FiDollarSign,
      color: "#2E7D32",
    },
    {
      title: "Attendance Rate",
      value: `${data.attendance.rate}%`,
      subtitle: `${data.attendance.present} present / ${data.attendance.total} total`,
      icon: FiTrendingUp,
      color: "#1565C0",
    },
    {
      title: "Prayer Requests",
      value: data.prayerRequests.total,
      icon: FiUsers,
      color: "#7C3AED",
    },
    {
      title: "Events Registered",
      value: data.events.registered,
      subtitle: `${data.events.attended} attended`,
      icon: FiCalendar,
      color: "#DC2626",
    },
    {
      title: "Services Attended",
      value: data.services.attended,
      subtitle: `${data.services.total} total service sessions`,
      icon: FiBook,
      color: "#F59E0B",
    },
  ];

  if (loading) {
    return (
      <div className="member-analytics-loading">
        <div className="member-analytics-loading-spinner"></div>
        <p>Loading analytics...</p>
      </div>
    );
  }

  const renderChart = (title: string, icon: React.ReactNode, chart: React.ReactNode, isEmpty: boolean) => (
    <div className="member-analytics-chart-card">
      <div className="member-analytics-chart-header">
        <h4 className="member-analytics-chart-title">
          {icon}
          {title}
        </h4>
      </div>
      <div className="member-analytics-chart-container">
        {isEmpty ? (
          <div className="member-analytics-no-data">No data available</div>
        ) : (
          chart
        )}
      </div>
    </div>
  );

  return (
    <div className="member-analytics-page">
      <div className="member-analytics-header">
        <div>
          <h2 className="member-analytics-title">My Analytics</h2>
          <p className="member-analytics-subtitle">Visual insights into your church activity</p>
        </div>
        <button className="member-analytics-refresh-btn" onClick={loadData}>
          <FiRefreshCw size={16} />
          Refresh
        </button>
      </div>

      <div className="member-analytics-date-range">
        <div className="member-analytics-date-group">
          <label>From</label>
          <input
            type="date"
            value={dateRange.startDate}
            onChange={(e) => setDateRange({ ...dateRange, startDate: e.target.value })}
          />
        </div>
        <div className="member-analytics-date-group">
          <label>To</label>
          <input
            type="date"
            value={dateRange.endDate}
            onChange={(e) => setDateRange({ ...dateRange, endDate: e.target.value })}
          />
        </div>
        <button className="member-analytics-apply-btn" onClick={loadData}>
          Apply
        </button>
      </div>

      <div className="member-analytics-summary-grid">
        {summaryCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <div key={index} className="member-analytics-summary-card">
              <div className="member-analytics-summary-card-icon" style={{ background: `${card.color}15`, color: card.color }}>
                <Icon size={24} />
              </div>
              <div className="member-analytics-summary-card-content">
                <h3 className="member-analytics-summary-card-value">{card.value}</h3>
                <p className="member-analytics-summary-card-title">{card.title}</p>
                {card.subtitle && (
                  <p className="member-analytics-summary-card-subtitle">{card.subtitle}</p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="member-analytics-charts-grid">
        {renderChart(
          "Giving Trend",
          <FiTrendingUp size={18} />,
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={getGivingMonthlyData()}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis tickFormatter={(value) => `$${value}`} />
              <Tooltip formatter={(value: any) => formatCurrency(value)} />
              <Legend />
              <Line type="monotone" dataKey="value" stroke="#2E7D32" strokeWidth={2} activeDot={{ r: 8 }} />
            </LineChart>
          </ResponsiveContainer>,
          getGivingMonthlyData().length === 0
        )}

        {renderChart(
          "Giving by Type",
          <FiPieChart size={18} />,
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={getGivingByTypeData()}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                outerRadius={70}
                dataKey="value"
              >
                {getGivingByTypeData().map((_entry: any, index: number) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value: any) => formatCurrency(value)} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>,
          getGivingByTypeData().length === 0
        )}

        {renderChart(
          "Attendance Trend",
          <FiBarChart2 size={18} />,
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={getAttendanceMonthlyData()}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Legend />
              <Bar yAxisId="left" dataKey="present" fill="#1565C0" radius={[4, 4, 0, 0]} />
              <Bar yAxisId="left" dataKey="total" fill="#93C5FD" radius={[4, 4, 0, 0]} />
              <Line yAxisId="right" type="monotone" dataKey="rate" stroke="#FFC107" strokeWidth={2} />
            </BarChart>
          </ResponsiveContainer>,
          getAttendanceMonthlyData().length === 0
        )}

        {renderChart(
          "Prayer Requests by Status",
          <FiPieChart size={18} />,
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie
                data={getPrayerByStatusData()}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                outerRadius={65}
                dataKey="value"
              >
                {getPrayerByStatusData().map((_entry: any, index: number) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>,
          getPrayerByStatusData().length === 0
        )}

        {renderChart(
          "Activity Summary",
          <FiBarChart2 size={18} />,
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={[
              { name: "Groups", value: data.groups.active },
              { name: "Events", value: data.events.registered },
              { name: "Prayers", value: data.prayerRequests.total },
            ]}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#7C3AED" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>,
          false
        )}

        {renderChart(
          "Services Attended (Monthly)",
          <FiBook size={18} />,
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={getServicesMonthlyData()}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#F59E0B" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>,
          getServicesMonthlyData().length === 0
        )}
      </div>

      <div className="member-analytics-quick-stats">
        <h4 className="member-analytics-quick-stats-title">Quick Insights</h4>
        <div className="member-analytics-quick-stats-grid">
          <div className="member-analytics-quick-stat">
            <span className="member-analytics-quick-stat-value">{data.giving.total > 0 ? data.giving.byType['tithe'] ? formatCurrency(data.giving.byType['tithe']) : formatCurrency(data.giving.total) : "$0.00"}</span>
            <span className="member-analytics-quick-stat-label">Tithes Given</span>
          </div>
          <div className="member-analytics-quick-stat">
            <span className="member-analytics-quick-stat-value">{formatCurrency(data.giving.total)}</span>
            <span className="member-analytics-quick-stat-label">Total Giving</span>
          </div>
          <div className="member-analytics-quick-stat">
            <span className="member-analytics-quick-stat-value">{data.attendance.rate}%</span>
            <span className="member-analytics-quick-stat-label">Attendance Rate</span>
          </div>
          <div className="member-analytics-quick-stat">
            <span className="member-analytics-quick-stat-value">{data.events.attended}</span>
            <span className="member-analytics-quick-stat-label">Events Attended</span>
          </div>
          <div className="member-analytics-quick-stat">
            <span className="member-analytics-quick-stat-value">{data.services.attended}</span>
            <span className="member-analytics-quick-stat-label">Services Attended</span>
          </div>
          <div className="member-analytics-quick-stat">
            <span className="member-analytics-quick-stat-value">{data.groups.active}</span>
            <span className="member-analytics-quick-stat-label">Active Groups</span>
          </div>
          <div className="member-analytics-quick-stat">
            <span className="member-analytics-quick-stat-value">{data.prayerRequests.total}</span>
            <span className="member-analytics-quick-stat-label">Prayer Requests</span>
          </div>
        </div>
      </div>
    </div>
  );
}