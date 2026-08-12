import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { 
  FiTrendingUp, FiPieChart, FiBarChart2, FiUsers, 
  FiDollarSign, FiCalendar, FiRefreshCw, FiDownload,
  FiHeart
} from "react-icons/fi";
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  Legend, ResponsiveContainer
} from "recharts";
import { fetchAttendanceSummary, fetchAttendance } from "../../../../Features/attendance/attendanceAPI";
import { fetchGivingSummary, fetchGivingTotal } from "../../../../Features/giving/givingAPI";
import { fetchExpensesSummary, fetchExpensesTotal } from "../../../../Features/expenses/expensesAPI";
import { fetchMembers } from "../../../../Features/members/membersAPI";
import { fetchServices } from "../../../../Features/services/servicesAPI";
import { fetchPledgesSummary } from "../../../../Features/pledges/pledgesAPI";
import "./Analytics.css";

const COLORS = ['#1565C0', '#2E7D32', '#FFC107', '#DC2626', '#7C3AED', '#EC4899', '#F59E0B', '#06B6D4', '#8B5CF6', '#EF4444'];

interface AnalyticsData {
  attendance: { total: number; present: number; absent: number; rate: number };
  giving: { total: number; byType: any[] };
  expenses: { total: number; byStatus: any[] };
  members: { total: number; active: number; leaders: number };
  pledges: { total: number; fulfilled: number; unfulfilled: number };
  services: { total: number; active: number };
  demographics: { gender: Record<string, number>; maritalStatus: Record<string, number> };
  attendanceTrend: any[];
  avgGivingPerMember: number;
}

export default function Analytics() {
  const token = useSelector((state: any) => state.user.token);
  const churchId = useSelector((state: any) => state.user.user?.churchId);
  
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<AnalyticsData>({
    attendance: { total: 0, present: 0, absent: 0, rate: 0 },
    giving: { total: 0, byType: [] },
    expenses: { total: 0, byStatus: [] },
    members: { total: 0, active: 0, leaders: 0 },
    pledges: { total: 0, fulfilled: 0, unfulfilled: 0 },
    services: { total: 0, active: 0 },
    demographics: { gender: {}, maritalStatus: {} },
    attendanceTrend: [],
    avgGivingPerMember: 0,
  });
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString().split("T")[0],
    endDate: new Date().toISOString().split("T")[0],
  });

  useEffect(() => {
    loadData();
  }, [dateRange]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [
        attendanceSummary,
        attendanceRecords,
        givingSummary,
        givingTotal,
        expensesSummary,
        expensesTotal,
        members,
        services,
        pledgesSummary
      ] = await Promise.all([
        fetchAttendanceSummary(1, token).catch(() => ({ total: 0, present: 0, absent: 0 })),
        fetchAttendance(token).catch(() => []),
        fetchGivingSummary(churchId, token).catch(() => []),
        fetchGivingTotal(churchId, token).catch(() => ({ total: 0 })),
        fetchExpensesSummary(churchId, token).catch(() => []),
        fetchExpensesTotal(churchId, token).catch(() => ({ total: 0 })),
        fetchMembers(token).catch(() => []),
        fetchServices(token).catch(() => []),
        fetchPledgesSummary(churchId, token).catch(() => ({ 
          total_pledges: 0, 
          total_amount: 0, 
          fulfilled_count: 0, 
          unfulfilled_count: 0,
          fulfilled_amount: 0,
          unfulfilled_amount: 0
        }))
      ]);

      const attendanceRate = attendanceSummary.total ? Math.round((attendanceSummary.present / attendanceSummary.total) * 100) : 0;
      const churchMembers = members.filter((m: any) => m.churchId === churchId);
      const churchServices = services.filter((s: any) => s.churchId === churchId);
      const churchAttendance = attendanceRecords.filter((a: any) => a.churchId === churchId);

      const genderCounts: Record<string, number> = {};
      const maritalCounts: Record<string, number> = {};
      churchMembers.forEach((m: any) => {
        if (m.gender) genderCounts[m.gender] = (genderCounts[m.gender] || 0) + 1;
        if (m.maritalStatus) maritalCounts[m.maritalStatus] = (maritalCounts[m.maritalStatus] || 0) + 1;
      });

      const monthlyTrend: Record<string, { present: number; total: number }> = {};
      churchAttendance.forEach((a: any) => {
        const month = new Date(a.date).toISOString().slice(0, 7);
        if (!monthlyTrend[month]) monthlyTrend[month] = { present: 0, total: 0 };
        monthlyTrend[month].total += 1;
        if (a.attended) monthlyTrend[month].present += 1;
      });
      const trendArray = Object.entries(monthlyTrend).map(([month, trendData]) => ({
        month,
        present: trendData.present,
        total: trendData.total,
        rate: trendData.total ? Math.round((trendData.present / trendData.total) * 100) : 0,
      }));

      const avgGivingPerMember = churchMembers.length ? Number(givingTotal.total) / churchMembers.length : 0;

      setData({
        attendance: {
          total: attendanceSummary.total || 0,
          present: attendanceSummary.present || 0,
          absent: attendanceSummary.absent || 0,
          rate: attendanceRate,
        },
        giving: {
          total: Number(givingTotal?.total || 0),
          byType: (givingSummary || []) as any,
        },
        expenses: {
          total: Number(expensesTotal?.total || 0),
          byStatus: (expensesSummary || []) as any,
        },
        members: {
          total: churchMembers.length,
          active: churchMembers.filter((m: any) => m.isActive).length,
          leaders: churchMembers.filter((m: any) => m.isLeader || m.role === 'pastor' || m.role === 'elder').length,
        },
        pledges: {
          total: Number(pledgesSummary?.total_amount || 0),
          fulfilled: Number(pledgesSummary?.fulfilled_amount || 0),
          unfulfilled: Number(pledgesSummary?.unfulfilled_amount || 0),
        },
        services: {
          total: churchServices.length,
          active: churchServices.filter((s: any) => s.isActive).length,
        },
        demographics: { gender: genderCounts, maritalStatus: maritalCounts },
        attendanceTrend: trendArray,
        avgGivingPerMember,
      });
    } catch (error) {
      console.error("Failed to load analytics data:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => `$${amount.toFixed(2)}`;

  if (loading) {
    return (
      <div className="analytics-loading">
        <div className="analytics-loading-spinner"></div>
        <p>Loading analytics...</p>
      </div>
    );
  }

  const givingTypeData = (data.giving.byType || []).map((item: any) => ({
    name: item.type || 'Unknown',
    value: Number(item.total_amount) || 0,
    count: item.count || 0,
  }));

  const expenseStatusData = (data.expenses.byStatus || []).map((item: any) => ({
    name: item.status || 'Unknown',
    value: Number(item.total_amount) || 0,
    count: item.count || 0,
  }));

  const genderData = Object.entries(data.demographics.gender || {}).map(([name, value]) => ({ name, value }));
  const maritalData = Object.entries(data.demographics.maritalStatus || {}).map(([name, value]) => ({ name, value }));
  const trendData = (data.attendanceTrend || []).map((item: any) => ({
    name: item.month || '',
    present: item.present || 0,
    total: item.total || 0,
    rate: item.rate || 0,
  }));

  const summaryCards = [
    { title: "Attendance Rate", value: `${data.attendance.rate}%`, icon: FiTrendingUp, color: "#1565C0" },
    { title: "Total Giving", value: formatCurrency(data.giving.total), icon: FiDollarSign, color: "#2E7D32" },
    { title: "Total Expenses", value: formatCurrency(data.expenses.total), icon: FiBarChart2, color: "#DC2626" },
    { title: "Total Members", value: data.members.total, icon: FiUsers, color: "#7C3AED" },
  ];

  const renderLabel = (entry: any) => {
    return `${entry.name || 'N/A'} ${((entry.percent || 0) * 100).toFixed(0)}%`;
  };

  return (
    <div className="analytics-page">
      <div className="analytics-header">
        <div>
          <h2 className="analytics-title">Analytics Dashboard</h2>
          <p className="analytics-subtitle">Visual insights into church performance</p>
        </div>
        <div className="analytics-actions">
          <button className="analytics-btn-secondary" onClick={loadData}>
            <FiRefreshCw size={16} />
            Refresh
          </button>
          <button className="analytics-btn-primary">
            <FiDownload size={16} />
            Export
          </button>
        </div>
      </div>

      <div className="analytics-date-range">
        <div className="analytics-date-group">
          <label>From</label>
          <input
            type="date"
            value={dateRange.startDate}
            onChange={(e) => setDateRange({ ...dateRange, startDate: e.target.value })}
          />
        </div>
        <div className="analytics-date-group">
          <label>To</label>
          <input
            type="date"
            value={dateRange.endDate}
            onChange={(e) => setDateRange({ ...dateRange, endDate: e.target.value })}
          />
        </div>
        <button className="analytics-btn-primary" onClick={loadData}>
          <FiCalendar size={16} />
          Apply
        </button>
      </div>

      <div className="analytics-summary-grid">
        {summaryCards.map((card, index) => (
          <div key={index} className="analytics-summary-card">
            <div className="analytics-summary-card-icon" style={{ background: `${card.color}15`, color: card.color }}>
              <card.icon size={24} />
            </div>
            <div className="analytics-summary-card-content">
              <h3 className="analytics-summary-card-value">{card.value}</h3>
              <p className="analytics-summary-card-title">{card.title}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="analytics-charts-grid">
        <div className="analytics-chart-card analytics-chart-large">
          <div className="analytics-chart-header">
            <h4 className="analytics-chart-title">
              <FiTrendingUp size={18} />
              Attendance Trend
            </h4>
          </div>
          <div className="analytics-chart-container">
            {trendData.length > 0 ? (
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Legend />
                  <Line yAxisId="left" type="monotone" dataKey="present" stroke="#1565C0" strokeWidth={2} activeDot={{ r: 8 }} />
                  <Line yAxisId="left" type="monotone" dataKey="total" stroke="#2E7D32" strokeWidth={2} />
                  <Line yAxisId="right" type="monotone" dataKey="rate" stroke="#FFC107" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="analytics-no-data">No attendance trend data available</div>
            )}
          </div>
        </div>

        <div className="analytics-chart-card analytics-chart-medium">
          <div className="analytics-chart-header">
            <h4 className="analytics-chart-title">
              <FiPieChart size={18} />
              Giving by Type
            </h4>
          </div>
          <div className="analytics-chart-container">
            {givingTypeData.length > 0 ? (
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie
                    data={givingTypeData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={renderLabel}
                    outerRadius={70}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {givingTypeData.map((_entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: any) => formatCurrency(value)} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="analytics-no-data">No giving data available</div>
            )}
          </div>
        </div>

        <div className="analytics-chart-card analytics-chart-medium">
          <div className="analytics-chart-header">
            <h4 className="analytics-chart-title">
              <FiPieChart size={18} />
              Expenses by Status
            </h4>
          </div>
          <div className="analytics-chart-container">
            {expenseStatusData.length > 0 ? (
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie
                    data={expenseStatusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={renderLabel}
                    outerRadius={70}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {expenseStatusData.map((_entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: any) => formatCurrency(value)} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="analytics-no-data">No expense data available</div>
            )}
          </div>
        </div>

        <div className="analytics-chart-card analytics-chart-large">
          <div className="analytics-chart-header">
            <h4 className="analytics-chart-title">
              <FiBarChart2 size={18} />
              Giving Breakdown
            </h4>
          </div>
          <div className="analytics-chart-container">
            {givingTypeData.length > 0 ? (
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={givingTypeData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value: any) => formatCurrency(value)} />
                  <Legend />
                  <Bar dataKey="value" fill="#2E7D32" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="analytics-no-data">No giving data available</div>
            )}
          </div>
        </div>

        <div className="analytics-chart-card analytics-chart-medium">
          <div className="analytics-chart-header">
            <h4 className="analytics-chart-title">
              <FiUsers size={18} />
              Gender Distribution
            </h4>
          </div>
          <div className="analytics-chart-container">
            {genderData.length > 0 ? (
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={genderData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#7C3AED" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="analytics-no-data">No gender data available</div>
            )}
          </div>
        </div>

        <div className="analytics-chart-card analytics-chart-medium">
          <div className="analytics-chart-header">
            <h4 className="analytics-chart-title">
              <FiHeart size={18} />
              Marital Status
            </h4>
          </div>
          <div className="analytics-chart-container">
            {maritalData.length > 0 ? (
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={maritalData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#EC4899" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="analytics-no-data">No marital status data available</div>
            )}
          </div>
        </div>

        <div className="analytics-chart-card analytics-chart-large">
          <div className="analytics-chart-header">
            <h4 className="analytics-chart-title">
              <FiTrendingUp size={18} />
              Net Balance Trend
            </h4>
          </div>
          <div className="analytics-chart-container">
            {trendData.length > 0 ? (
              <ResponsiveContainer width="100%" height={240}>
                <AreaChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value: any) => formatCurrency(value)} />
                  <Area type="monotone" dataKey="rate" stroke="#8884d8" fill="#8884d8" fillOpacity={0.3} />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="analytics-no-data">No trend data available</div>
            )}
          </div>
        </div>
      </div>

      <div className="analytics-quick-stats">
        <h4 className="analytics-quick-stats-title">
          <FiBarChart2 size={18} />
          Quick Insights
        </h4>
        <div className="analytics-quick-stats-grid">
          <div className="analytics-quick-stat">
            <span className="analytics-quick-stat-value">{data.attendance.total}</span>
            <span className="analytics-quick-stat-label">Total Attendees</span>
          </div>
          <div className="analytics-quick-stat">
            <span className="analytics-quick-stat-value">{formatCurrency(data.giving.total)}</span>
            <span className="analytics-quick-stat-label">Total Giving</span>
          </div>
          <div className="analytics-quick-stat">
            <span className="analytics-quick-stat-value">{formatCurrency(data.expenses.total)}</span>
            <span className="analytics-quick-stat-label">Total Expenses</span>
          </div>
          <div className="analytics-quick-stat">
            <span className="analytics-quick-stat-value">
              {formatCurrency(data.giving.total - data.expenses.total)}
            </span>
            <span className="analytics-quick-stat-label">Net Balance</span>
          </div>
          <div className="analytics-quick-stat">
            <span className="analytics-quick-stat-value">{data.members.total}</span>
            <span className="analytics-quick-stat-label">Total Members</span>
          </div>
          <div className="analytics-quick-stat">
            <span className="analytics-quick-stat-value">{data.services.active}</span>
            <span className="analytics-quick-stat-label">Active Services</span>
          </div>
          <div className="analytics-quick-stat">
            <span className="analytics-quick-stat-value">{formatCurrency(data.avgGivingPerMember)}</span>
            <span className="analytics-quick-stat-label">Avg Giving/Member</span>
          </div>
        </div>
      </div>
    </div>
  );
}