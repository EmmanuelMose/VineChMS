import { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { 
  FiCalendar, FiDollarSign, FiUsers, FiTrendingUp, 
  FiDownload, FiClock, 
  FiUserCheck, FiTag, 
  FiChevronDown, FiChevronRight, FiRefreshCw
} from "react-icons/fi";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { fetchAttendanceSummary, fetchAttendance } from "../../../../Features/attendance/attendanceAPI";
import { fetchGivingSummary, fetchGivingTotal, fetchGivingCategories } from "../../../../Features/giving/givingAPI";
import { fetchExpensesSummary, fetchExpensesTotal, fetchExpenseCategories } from "../../../../Features/expenses/expensesAPI";
import { fetchMembers } from "../../../../Features/members/membersAPI";
import { fetchServices } from "../../../../Features/services/servicesAPI";
import { fetchPledgesSummary } from "../../../../Features/pledges/pledgesAPI";
import "./Reports.css";

interface ReportCard {
  id: string;
  title: string;
  value: string | number;
  subtitle: string;
  icon: React.ComponentType<{ size: number }>;
  color: string;
  trend?: number;
}

interface CategorySummary {
  name: string;
  total: number;
  count: number;
}

interface Demographics {
  gender: Record<string, number>;
  maritalStatus: Record<string, number>;
}

interface AttendanceTrendItem {
  month: string;
  present: number;
  total: number;
  rate: number;
}

interface ReportData {
  attendance: {
    total: number;
    present: number;
    absent: number;
    rate: number;
  };
  giving: {
    total: number;
    byType: any[];
  };
  givingByCategory: CategorySummary[];
  expenses: {
    total: number;
    byStatus: any[];
  };
  expensesByCategory: CategorySummary[];
  members: {
    total: number;
    active: number;
    leaders: number;
  };
  pledges: {
    total: number;
    fulfilled: number;
    unfulfilled: number;
  };
  services: {
    total: number;
    active: number;
  };
  demographics: Demographics;
  attendanceTrend: AttendanceTrendItem[];
  avgGivingPerMember: number;
}

export default function Reports() {
  const token = useSelector((state: any) => state.user.token);
  const churchId = useSelector((state: any) => state.user.user?.churchId);
  const user = useSelector((state: any) => state.user.user);
  
  const [loading, setLoading] = useState(true);
  const [reportData, setReportData] = useState<ReportData>({
    attendance: { total: 0, present: 0, absent: 0, rate: 0 },
    giving: { total: 0, byType: [] },
    givingByCategory: [],
    expenses: { total: 0, byStatus: [] },
    expensesByCategory: [],
    members: { total: 0, active: 0, leaders: 0 },
    pledges: { total: 0, fulfilled: 0, unfulfilled: 0 },
    services: { total: 0, active: 0 },
    demographics: { gender: {}, maritalStatus: {} },
    attendanceTrend: [] as AttendanceTrendItem[],
    avgGivingPerMember: 0,
  });
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString().split("T")[0],
    endDate: new Date().toISOString().split("T")[0],
  });
  const [activeTab, setActiveTab] = useState('overview');
  const [expandedSections, setExpandedSections] = useState({
    giving: true,
    expenses: true,
    attendance: true,
    members: true,
    demographics: true,
    trend: true,
  });
  const [exporting, setExporting] = useState(false);
  const reportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadReports();
  }, [dateRange]);

  const loadReports = async () => {
    try {
      setLoading(true);
      
      // Fetch all required data in parallel
      const [
        attendanceSummary,
        attendanceRecords,
        givingSummary,
        givingTotal,
        givingCategories,
        expensesSummary,
        expensesTotal,
        expenseCategories,
        members,
        services,
        pledgesSummary
      ] = await Promise.all([
        fetchAttendanceSummary(1, token).catch(() => ({ total: 0, present: 0, absent: 0 })),
        fetchAttendance(token).catch(() => []),
        fetchGivingSummary(churchId, token).catch(() => []),
        fetchGivingTotal(churchId, token).catch(() => ({ total: 0 })),
        fetchGivingCategories(token).catch(() => []),
        fetchExpensesSummary(churchId, token).catch(() => []),
        fetchExpensesTotal(churchId, token).catch(() => ({ total: 0 })),
        fetchExpenseCategories(token).catch(() => []),
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
      
      // Filter by church
      const churchMembers = members.filter((m: any) => m.churchId === churchId);
      const churchServices = services.filter((s: any) => s.churchId === churchId);
      const churchGivingCategories = givingCategories.filter((c: any) => c.churchId === churchId);
      const churchExpenseCategories = expenseCategories.filter((c: any) => c.churchId === churchId);
      const churchAttendance = attendanceRecords.filter((a: any) => a.churchId === churchId);

      // Giving by category
      const givingByCategory = churchGivingCategories.map((cat: any) => {
        const total = churchAttendance
          .filter((a: any) => a.giving && a.giving.categoryId === cat.categoryId)
          .reduce((sum: number, a: any) => sum + (a.giving?.amount || 0), 0);
        return { name: cat.name, total, count: churchAttendance.filter((a: any) => a.giving?.categoryId === cat.categoryId).length };
      });

      // Expenses by category
      const expensesByCategory = churchExpenseCategories.map((cat: any) => {
        const total = churchAttendance
          .filter((a: any) => a.expenses && a.expenses.categoryId === cat.categoryId)
          .reduce((sum: number, a: any) => sum + (a.expenses?.amount || 0), 0);
        return { name: cat.name, total, count: churchAttendance.filter((a: any) => a.expenses?.categoryId === cat.categoryId).length };
      });

      // Demographics
      const genderCounts: Record<string, number> = {};
      const maritalCounts: Record<string, number> = {};
      churchMembers.forEach((m: any) => {
        if (m.gender) genderCounts[m.gender] = (genderCounts[m.gender] || 0) + 1;
        if (m.maritalStatus) maritalCounts[m.maritalStatus] = (maritalCounts[m.maritalStatus] || 0) + 1;
      });

      // Attendance trend (monthly)
      const monthlyTrend: Record<string, { present: number; total: number }> = {};
      churchAttendance.forEach((a: any) => {
        const month = new Date(a.date).toISOString().slice(0, 7); // YYYY-MM
        if (!monthlyTrend[month]) monthlyTrend[month] = { present: 0, total: 0 };
        monthlyTrend[month].total += 1;
        if (a.attended) monthlyTrend[month].present += 1;
      });
      const trendArray = Object.entries(monthlyTrend).map(([month, data]) => ({
        month,
        present: data.present,
        total: data.total,
        rate: data.total ? Math.round((data.present / data.total) * 100) : 0,
      }));

      // Average giving per member
      const avgGivingPerMember = churchMembers.length ? Number(givingTotal.total) / churchMembers.length : 0;

      setReportData({
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
        givingByCategory,
        expenses: {
          total: Number(expensesTotal?.total || 0),
          byStatus: (expensesSummary || []) as any,
        },
        expensesByCategory,
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
      console.error("Failed to load reports:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const formatCurrency = (amount: number) => {
    return `$${amount.toFixed(2)}`;
  };

  const exportPDF = async () => {
    if (!reportRef.current) return;
    setExporting(true);
    try {
      const doc = new jsPDF('p', 'mm', 'a4');
      const pageWidth = doc.internal.pageSize.getWidth();
      
      // Header
      doc.setFontSize(20);
      doc.setTextColor(21, 101, 192);
      doc.text('VineChMS - Church Report', pageWidth / 2, 20, { align: 'center' });
      
      doc.setFontSize(12);
      doc.setTextColor(100);
      const churchName = user?.churchId ? `Church ID: ${user.churchId}` : 'All Churches';
      doc.text(`Generated: ${new Date().toLocaleString()}`, pageWidth / 2, 28, { align: 'center' });
      doc.text(`Church: ${churchName}`, pageWidth / 2, 34, { align: 'center' });
      doc.text(`Date Range: ${dateRange.startDate} to ${dateRange.endDate}`, pageWidth / 2, 40, { align: 'center' });
      
      // Summary Stats Table
      const statsData = [
        ['Metric', 'Value'],
        ['Total Members', reportData.members.total.toString()],
        ['Active Members', reportData.members.active.toString()],
        ['Leaders', reportData.members.leaders.toString()],
        ['Total Services', reportData.services.total.toString()],
        ['Active Services', reportData.services.active.toString()],
        ['Attendance Rate', `${reportData.attendance.rate}%`],
        ['Total Giving', formatCurrency(reportData.giving.total)],
        ['Average Giving per Member', formatCurrency(reportData.avgGivingPerMember)],
        ['Total Expenses', formatCurrency(reportData.expenses.total)],
        ['Net Balance', formatCurrency(reportData.giving.total - reportData.expenses.total)],
        ['Total Pledged', formatCurrency(reportData.pledges.total)],
        ['Fulfilled Pledges', formatCurrency(reportData.pledges.fulfilled)],
        ['Unfulfilled Pledges', formatCurrency(reportData.pledges.unfulfilled)],
      ];
      
      autoTable(doc, {
        head: [statsData[0]],
        body: statsData.slice(1),
        startY: 48,
        styles: { fontSize: 9 },
        headStyles: { fillColor: [21, 101, 192], textColor: [255, 255, 255] },
        alternateRowStyles: { fillColor: [240, 244, 248] },
      });
      
      let y = (doc as any).lastAutoTable.finalY + 10;
      
      // Giving by Type
      if (reportData.giving.byType.length > 0) {
        doc.setFontSize(14);
        doc.setTextColor(0);
        doc.text('Giving by Type', 14, y);
        y += 6;
        const givingTypeData = reportData.giving.byType.map((item: any) => [
          item.type,
          formatCurrency(Number(item.total_amount)),
          `${item.count} gifts`
        ]);
        autoTable(doc, {
          head: [['Type', 'Amount', 'Count']],
          body: givingTypeData,
          startY: y,
          styles: { fontSize: 8 },
          headStyles: { fillColor: [46, 125, 50], textColor: [255, 255, 255] },
          alternateRowStyles: { fillColor: [240, 244, 248] },
        });
        y = (doc as any).lastAutoTable.finalY + 10;
      }

      // Giving by Category
      if (reportData.givingByCategory.length > 0) {
        doc.setFontSize(14);
        doc.setTextColor(0);
        doc.text('Giving by Category', 14, y);
        y += 6;
        const givingCatData = reportData.givingByCategory.map((item: any) => [
          item.name,
          formatCurrency(item.total),
          `${item.count} gifts`
        ]);
        autoTable(doc, {
          head: [['Category', 'Amount', 'Count']],
          body: givingCatData,
          startY: y,
          styles: { fontSize: 8 },
          headStyles: { fillColor: [46, 125, 50], textColor: [255, 255, 255] },
          alternateRowStyles: { fillColor: [240, 244, 248] },
        });
        y = (doc as any).lastAutoTable.finalY + 10;
      }
      
      // Expenses by Status
      if (reportData.expenses.byStatus.length > 0) {
        doc.setFontSize(14);
        doc.setTextColor(0);
        doc.text('Expenses by Status', 14, y);
        y += 6;
        const expenseStatusData = reportData.expenses.byStatus.map((item: any) => [
          item.status,
          formatCurrency(Number(item.total_amount)),
          `${item.count} expenses`
        ]);
        autoTable(doc, {
          head: [['Status', 'Amount', 'Count']],
          body: expenseStatusData,
          startY: y,
          styles: { fontSize: 8 },
          headStyles: { fillColor: [220, 38, 38], textColor: [255, 255, 255] },
          alternateRowStyles: { fillColor: [240, 244, 248] },
        });
        y = (doc as any).lastAutoTable.finalY + 10;
      }

      // Expenses by Category
      if (reportData.expensesByCategory.length > 0) {
        doc.setFontSize(14);
        doc.setTextColor(0);
        doc.text('Expenses by Category', 14, y);
        y += 6;
        const expenseCatData = reportData.expensesByCategory.map((item: any) => [
          item.name,
          formatCurrency(item.total),
          `${item.count} expenses`
        ]);
        autoTable(doc, {
          head: [['Category', 'Amount', 'Count']],
          body: expenseCatData,
          startY: y,
          styles: { fontSize: 8 },
          headStyles: { fillColor: [220, 38, 38], textColor: [255, 255, 255] },
          alternateRowStyles: { fillColor: [240, 244, 248] },
        });
        y = (doc as any).lastAutoTable.finalY + 10;
      }

      // Member Demographics
      if (Object.keys(reportData.demographics.gender).length > 0 || Object.keys(reportData.demographics.maritalStatus).length > 0) {
        doc.setFontSize(14);
        doc.setTextColor(0);
        doc.text('Member Demographics', 14, y);
        y += 6;
        const demographicsRows: any[] = [];
        if (Object.keys(reportData.demographics.gender).length > 0) {
          demographicsRows.push(['Gender', ...Object.keys(reportData.demographics.gender)]);
          demographicsRows.push(['Count', ...Object.values(reportData.demographics.gender)]);
        }
        if (Object.keys(reportData.demographics.maritalStatus).length > 0) {
          demographicsRows.push(['Marital Status', ...Object.keys(reportData.demographics.maritalStatus)]);
          demographicsRows.push(['Count', ...Object.values(reportData.demographics.maritalStatus)]);
        }
        autoTable(doc, {
          body: demographicsRows,
          startY: y,
          styles: { fontSize: 8 },
          headStyles: { fillColor: [128, 90, 213], textColor: [255, 255, 255] },
          alternateRowStyles: { fillColor: [240, 244, 248] },
          theme: 'striped',
        });
        y = (doc as any).lastAutoTable.finalY + 10;
      }

      // Attendance Trend
      if (reportData.attendanceTrend.length > 0) {
        doc.setFontSize(14);
        doc.setTextColor(0);
        doc.text('Monthly Attendance Trend', 14, y);
        y += 6;
        const trendData = reportData.attendanceTrend.map((item: any) => [
          item.month,
          item.total,
          item.present,
          `${item.rate}%`
        ]);
        autoTable(doc, {
          head: [['Month', 'Total', 'Present', 'Rate']],
          body: trendData,
          startY: y,
          styles: { fontSize: 8 },
          headStyles: { fillColor: [21, 101, 192], textColor: [255, 255, 255] },
          alternateRowStyles: { fillColor: [240, 244, 248] },
        });
        y = (doc as any).lastAutoTable.finalY + 10;
      }
      
      // Footer
      const pageCount = doc.internal.pages.length;
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(150);
        doc.text(`Page ${i} of ${pageCount}`, pageWidth - 20, doc.internal.pageSize.getHeight() - 10);
        doc.text('Generated by VineChMS', 14, doc.internal.pageSize.getHeight() - 10);
      }
      
      doc.save(`church-report-${new Date().toISOString().split('T')[0]}.pdf`);
    } catch (error) {
      console.error('PDF export failed:', error);
      alert('Failed to export PDF. Please try again.');
    } finally {
      setExporting(false);
    }
  };

  const reportCards: ReportCard[] = [
    {
      id: "attendance",
      title: "Attendance Rate",
      value: `${reportData.attendance.rate}%`,
      subtitle: `${reportData.attendance.present} present / ${reportData.attendance.total} total`,
      icon: FiUserCheck,
      color: "#1565C0",
      trend: reportData.attendance.rate > 70 ? 5 : -2,
    },
    {
      id: "giving",
      title: "Total Giving",
      value: `$${reportData.giving.total.toFixed(2)}`,
      subtitle: `Avg ${formatCurrency(reportData.avgGivingPerMember)} per member`,
      icon: FiDollarSign,
      color: "#16a34a",
    },
    {
      id: "expenses",
      title: "Total Expenses",
      value: `$${reportData.expenses.total.toFixed(2)}`,
      subtitle: `${reportData.expenses.byStatus.length} status categories`,
      icon: FiTrendingUp,
      color: "#dc2626",
    },
    {
      id: "members",
      title: "Total Members",
      value: reportData.members.total,
      subtitle: `${reportData.members.active} active, ${reportData.members.leaders} leaders`,
      icon: FiUsers,
      color: "#7c3aed",
    },
  ];

  if (loading) {
    return (
      <div className="reports-loading">
        <div className="reports-loading-spinner"></div>
        <p>Loading reports...</p>
      </div>
    );
  }

  return (
    <div className="reports-page" ref={reportRef}>
      <div className="reports-header">
        <div>
          <h2 className="reports-title">Reports & Analytics</h2>
          <p className="reports-subtitle">View church statistics and insights</p>
        </div>
        <div className="reports-actions">
          <button className="reports-btn-secondary" onClick={loadReports}>
            <FiRefreshCw size={16} />
            Refresh
          </button>
          <button 
            className="reports-btn-primary" 
            onClick={exportPDF}
            disabled={exporting}
          >
            <FiDownload size={16} />
            {exporting ? 'Exporting...' : 'Export PDF'}
          </button>
        </div>
      </div>

      <div className="reports-date-range">
        <div className="reports-date-group">
          <label>From</label>
          <input
            type="date"
            value={dateRange.startDate}
            onChange={(e) => setDateRange({ ...dateRange, startDate: e.target.value })}
          />
        </div>
        <div className="reports-date-group">
          <label>To</label>
          <input
            type="date"
            value={dateRange.endDate}
            onChange={(e) => setDateRange({ ...dateRange, endDate: e.target.value })}
          />
        </div>
        <button className="reports-btn-primary" onClick={loadReports}>
          <FiCalendar size={16} />
          Apply
        </button>
      </div>

      <div className="reports-tabs">
        <button 
          className={`reports-tab ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button 
          className={`reports-tab ${activeTab === 'financial' ? 'active' : ''}`}
          onClick={() => setActiveTab('financial')}
        >
          Financial
        </button>
        <button 
          className={`reports-tab ${activeTab === 'people' ? 'active' : ''}`}
          onClick={() => setActiveTab('people')}
        >
          People
        </button>
        <button 
          className={`reports-tab ${activeTab === 'trends' ? 'active' : ''}`}
          onClick={() => setActiveTab('trends')}
        >
          Trends
        </button>
      </div>

      <div className="reports-grid">
        {reportCards.map((card) => (
          <div key={card.id} className="reports-card">
            <div className="reports-card-header">
              <div className="reports-card-icon" style={{ background: `${card.color}15`, color: card.color }}>
                <card.icon size={24} />
              </div>
              {card.trend !== undefined && (
                <span className={`reports-trend ${card.trend > 0 ? 'trend-up' : 'trend-down'}`}>
                  {card.trend > 0 ? '↑' : '↓'} {Math.abs(card.trend)}%
                </span>
              )}
            </div>
            <h3 className="reports-card-value">{card.value}</h3>
            <p className="reports-card-title">{card.title}</p>
            <p className="reports-card-subtitle">{card.subtitle}</p>
          </div>
        ))}
      </div>

      {/* Giving by Category (new) */}
      <div className="reports-charts-grid">
        <div className="reports-chart-card">
          <div className="reports-chart-header">
            <h4 className="reports-chart-title">
              <FiTag size={18} />
              Giving by Category
            </h4>
            <button 
              className="reports-chart-toggle"
              onClick={() => toggleSection('giving')}
            >
              {expandedSections.giving ? <FiChevronDown size={18} /> : <FiChevronRight size={18} />}
            </button>
          </div>
          {expandedSections.giving && (
            <div className="reports-chart-content">
              {reportData.givingByCategory.length > 0 ? (
                reportData.givingByCategory.map((item: any) => {
                  const percentage = reportData.giving.total > 0 
                    ? (item.total / reportData.giving.total) * 100 
                    : 0;
                  return (
                    <div key={item.name} className="reports-chart-bar">
                      <div className="reports-chart-bar-label">
                        <span className="reports-chart-bar-type">{item.name}</span>
                        <span className="reports-chart-bar-amount">{formatCurrency(item.total)}</span>
                      </div>
                      <div className="reports-chart-bar-track">
                        <div 
                          className="reports-chart-bar-fill"
                          style={{ 
                            width: `${percentage}%`,
                            background: `hsl(${Math.random() * 360}, 70%, 50%)`
                          }}
                        />
                      </div>
                      <span className="reports-chart-bar-count">{item.count} gifts</span>
                    </div>
                  );
                })
              ) : (
                <p className="reports-chart-empty">No giving category data</p>
              )}
            </div>
          )}
        </div>

        {/* Expenses by Category (new) */}
        <div className="reports-chart-card">
          <div className="reports-chart-header">
            <h4 className="reports-chart-title">
              <FiTag size={18} />
              Expenses by Category
            </h4>
            <button 
              className="reports-chart-toggle"
              onClick={() => toggleSection('expenses')}
            >
              {expandedSections.expenses ? <FiChevronDown size={18} /> : <FiChevronRight size={18} />}
            </button>
          </div>
          {expandedSections.expenses && (
            <div className="reports-chart-content">
              {reportData.expensesByCategory.length > 0 ? (
                reportData.expensesByCategory.map((item: any) => {
                  const percentage = reportData.expenses.total > 0 
                    ? (item.total / reportData.expenses.total) * 100 
                    : 0;
                  return (
                    <div key={item.name} className="reports-chart-bar">
                      <div className="reports-chart-bar-label">
                        <span className="reports-chart-bar-type">{item.name}</span>
                        <span className="reports-chart-bar-amount">{formatCurrency(item.total)}</span>
                      </div>
                      <div className="reports-chart-bar-track">
                        <div 
                          className="reports-chart-bar-fill"
                          style={{ 
                            width: `${percentage}%`,
                            background: `hsl(${Math.random() * 360}, 70%, 50%)`
                          }}
                        />
                      </div>
                      <span className="reports-chart-bar-count">{item.count} expenses</span>
                    </div>
                  );
                })
              ) : (
                <p className="reports-chart-empty">No expense category data</p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Demographics and Trends */}
      <div className="reports-details-grid">
        <div className="reports-detail-card">
          <div className="reports-detail-header">
            <h4 className="reports-detail-title">
              <FiUsers size={18} />
              Member Demographics
            </h4>
            <button 
              className="reports-detail-toggle"
              onClick={() => toggleSection('demographics')}
            >
              {expandedSections.demographics ? <FiChevronDown size={18} /> : <FiChevronRight size={18} />}
            </button>
          </div>
          {expandedSections.demographics && (
            <div className="reports-detail-content">
              <div className="reports-detail-stats">
                {Object.entries(reportData.demographics.gender).map(([gender, count]) => (
                  <div key={gender} className="reports-detail-stat">
                    <span className="reports-detail-stat-value">{String(count)}</span>
                    <span className="reports-detail-stat-label">{gender}</span>
                  </div>
                ))}
                {Object.entries(reportData.demographics.maritalStatus).map(([status, count]) => (
                  <div key={status} className="reports-detail-stat">
                    <span className="reports-detail-stat-value">{String(count)}</span>
                    <span className="reports-detail-stat-label">{status}</span>
                  </div>
                ))}
                {Object.keys(reportData.demographics.gender).length === 0 && 
                 Object.keys(reportData.demographics.maritalStatus).length === 0 && (
                  <p className="reports-chart-empty">No demographic data</p>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="reports-detail-card">
          <div className="reports-detail-header">
            <h4 className="reports-detail-title">
              <FiTrendingUp size={18} />
              Attendance Trend (Monthly)
            </h4>
            <button 
              className="reports-detail-toggle"
              onClick={() => toggleSection('trend')}
            >
              {expandedSections.trend ? <FiChevronDown size={18} /> : <FiChevronRight size={18} />}
            </button>
          </div>
          {expandedSections.trend && (
            <div className="reports-detail-content">
              {reportData.attendanceTrend.length > 0 ? (
                reportData.attendanceTrend.map((item: any) => (
                  <div key={item.month} className="reports-detail-stat" style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid #f3f4f6' }}>
                    <span>{item.month}</span>
                    <span>{item.present} / {item.total} ({item.rate}%)</span>
                  </div>
                ))
              ) : (
                <p className="reports-chart-empty">No trend data</p>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="reports-quick-stats">
        <h4 className="reports-quick-stats-title">
          <FiClock size={18} />
          Quick Insights
        </h4>
        <div className="reports-quick-stats-grid">
          <div className="reports-quick-stat">
            <span className="reports-quick-stat-value">{reportData.attendance.total}</span>
            <span className="reports-quick-stat-label">Total Attendees</span>
          </div>
          <div className="reports-quick-stat">
            <span className="reports-quick-stat-value">{formatCurrency(reportData.giving.total)}</span>
            <span className="reports-quick-stat-label">Total Giving</span>
          </div>
          <div className="reports-quick-stat">
            <span className="reports-quick-stat-value">{formatCurrency(reportData.expenses.total)}</span>
            <span className="reports-quick-stat-label">Total Expenses</span>
          </div>
          <div className="reports-quick-stat">
            <span className="reports-quick-stat-value">
              {formatCurrency(reportData.giving.total - reportData.expenses.total)}
            </span>
            <span className="reports-quick-stat-label">Net Balance</span>
          </div>
          <div className="reports-quick-stat">
            <span className="reports-quick-stat-value">{reportData.members.total}</span>
            <span className="reports-quick-stat-label">Total Members</span>
          </div>
          <div className="reports-quick-stat">
            <span className="reports-quick-stat-value">{reportData.services.active}</span>
            <span className="reports-quick-stat-label">Active Services</span>
          </div>
          <div className="reports-quick-stat">
            <span className="reports-quick-stat-value">{formatCurrency(reportData.avgGivingPerMember)}</span>
            <span className="reports-quick-stat-label">Avg Giving/Member</span>
          </div>
        </div>
      </div>
    </div>
  );
}