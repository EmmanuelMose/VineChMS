import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { FiCalendar, FiDollarSign, FiUsers, FiTrendingUp, FiDownload, FiRefreshCw, FiBook } from "react-icons/fi";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { fetchGivingByMember } from "../../../../Features/giving/givingAPI";
import { fetchAttendanceByMember } from "../../../../Features/attendance/attendanceAPI";
import { fetchMemberByUserId } from "../../../../Features/members/membersAPI";
import { fetchPrayerRequests } from "../../../../Features/prayer/PrayerAPI";
import { fetchGroups } from "../../../../Features/groups/groupsAPI";
import { fetchMemberEventRegistrations } from "../../../../Features/events/eventsAPI";
import { fetchServices } from "../../../../Features/services/servicesAPI";
import "./Reports.css";

interface ReportStats {
  giving: {
    total: number;
    count: number;
    byType: { type: string; amount: number }[];
  };
  attendance: {
    total: number;
    present: number;
    absent: number;
    rate: number;
  };
  prayerRequests: {
    total: number;
    byStatus: { status: string; count: number }[];
  };
  groups: {
    total: number;
    active: number;
  };
  events: {
    registered: number;
    attended: number;
  };
  services: {
    total: number;
    attended: number;
  };
}

export default function Reports() {
  const token = useSelector((state: any) => state.user.token);
  const churchId = useSelector((state: any) => state.user.user?.churchId);
  const userId = useSelector((state: any) => state.user.user?.userId);

  const [memberId, setMemberId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [startDate, setStartDate] = useState(
    new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString().split("T")[0]
  );
  const [endDate, setEndDate] = useState(new Date().toISOString().split("T")[0]);
  const [stats, setStats] = useState<ReportStats>({
    giving: { total: 0, count: 0, byType: [] },
    attendance: { total: 0, present: 0, absent: 0, rate: 0 },
    prayerRequests: { total: 0, byStatus: [] },
    groups: { total: 0, active: 0 },
    events: { registered: 0, attended: 0 },
    services: { total: 0, attended: 0 },
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
  }, [memberId, startDate, endDate]);

  const loadData = async () => {
    if (!memberId || !token) return;
    try {
      setLoading(true);
      const [givingData, attendanceData, prayersData, groupsData, eventRegistrations] = await Promise.all([
        fetchGivingByMember(memberId, token).catch(() => []),
        fetchAttendanceByMember(memberId, token).catch(() => []),
        fetchPrayerRequests(token).catch(() => []),
        fetchGroups(token).catch(() => []),
        fetchMemberEventRegistrations(memberId, token).catch(() => []),
        fetchServices(token).catch(() => []),
      ]);

      const churchPrayers = prayersData.filter((p) => p.churchId === churchId);
      const churchGroups = groupsData.filter((g) => g.churchId === churchId);

      const byType: Record<string, number> = {};
      let totalGiving = 0;
      givingData.forEach((g) => {
        totalGiving += parseFloat(g.amount);
        byType[g.type] = (byType[g.type] || 0) + parseFloat(g.amount);
      });

      const present = attendanceData.filter((a) => a.attended).length;
      const rate = attendanceData.length > 0 ? Math.round((present / attendanceData.length) * 100) : 0;

      const prayerByStatus: Record<string, number> = {};
      churchPrayers.forEach((p) => {
        prayerByStatus[p.status] = (prayerByStatus[p.status] || 0) + 1;
      });

      const registeredEvents = eventRegistrations.length;
      const attendedEvents = eventRegistrations.filter((r) => r.attended).length;

      const totalServiceAttendance = attendanceData.length;
      const attendedServiceCount = attendanceData.filter((a) => a.attended).length;

      setStats({
        giving: {
          total: totalGiving,
          count: givingData.length,
          byType: Object.entries(byType).map(([type, amount]) => ({ type, amount })),
        },
        attendance: {
          total: attendanceData.length,
          present,
          absent: attendanceData.length - present,
          rate,
        },
        prayerRequests: {
          total: churchPrayers.length,
          byStatus: Object.entries(prayerByStatus).map(([status, count]) => ({ status, count })),
        },
        groups: {
          total: churchGroups.length,
          active: churchGroups.filter((g) => g.isActive).length,
        },
        events: {
          registered: registeredEvents,
          attended: attendedEvents,
        },
        services: {
          total: totalServiceAttendance,
          attended: attendedServiceCount,
        },
      });
    } catch (error) {
      console.error("Failed to load report data:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => `$${amount.toFixed(2)}`;

  const exportPDF = async () => {
    setExporting(true);
    try {
      const doc = new jsPDF("p", "mm", "a4");
      const pageWidth = doc.internal.pageSize.getWidth();

      doc.setFontSize(20);
      doc.setTextColor(21, 101, 192);
      doc.text("My Church Report", pageWidth / 2, 20, { align: "center" });

      doc.setFontSize(12);
      doc.setTextColor(100);
      const dateStr = new Date().toLocaleString();
      doc.text(`Generated: ${dateStr}`, pageWidth / 2, 28, { align: "center" });
      doc.text(`Date Range: ${startDate} to ${endDate}`, pageWidth / 2, 34, { align: "center" });

      const summaryData = [
        ["Metric", "Value"],
        ["Total Giving", formatCurrency(stats.giving.total)],
        ["Giving Records", stats.giving.count.toString()],
        ["Attendance Rate", `${stats.attendance.rate}%`],
        ["Total Attendances", stats.attendance.total.toString()],
        ["Present", stats.attendance.present.toString()],
        ["Absent", stats.attendance.absent.toString()],
        ["Services Attended", stats.services.attended.toString()],
        ["Prayer Requests", stats.prayerRequests.total.toString()],
        ["Groups Active", stats.groups.active.toString()],
        ["Events Registered", stats.events.registered.toString()],
        ["Events Attended", stats.events.attended.toString()],
      ];

      autoTable(doc, {
        head: [summaryData[0]],
        body: summaryData.slice(1),
        startY: 42,
        styles: { fontSize: 9 },
        headStyles: { fillColor: [21, 101, 192], textColor: [255, 255, 255] },
        alternateRowStyles: { fillColor: [240, 244, 248] },
      });

      let y = (doc as any).lastAutoTable.finalY + 10;

      if (stats.giving.byType.length > 0) {
        doc.setFontSize(14);
        doc.setTextColor(0);
        doc.text("Giving by Type", 14, y);
        y += 6;
        const typeData = stats.giving.byType.map((item) => [
          item.type,
          formatCurrency(item.amount),
        ]);
        autoTable(doc, {
          head: [["Type", "Amount"]],
          body: typeData,
          startY: y,
          styles: { fontSize: 8 },
          headStyles: { fillColor: [46, 125, 50], textColor: [255, 255, 255] },
          alternateRowStyles: { fillColor: [240, 244, 248] },
        });
        y = (doc as any).lastAutoTable.finalY + 10;
      }

      if (stats.prayerRequests.byStatus.length > 0) {
        doc.setFontSize(14);
        doc.text("Prayer Requests by Status", 14, y);
        y += 6;
        const prayerData = stats.prayerRequests.byStatus.map((item) => [
          item.status,
          item.count.toString(),
        ]);
        autoTable(doc, {
          head: [["Status", "Count"]],
          body: prayerData,
          startY: y,
          styles: { fontSize: 8 },
          headStyles: { fillColor: [128, 90, 213], textColor: [255, 255, 255] },
          alternateRowStyles: { fillColor: [240, 244, 248] },
        });
        y = (doc as any).lastAutoTable.finalY + 10;
      }

      const pageCount = doc.internal.pages.length;
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(150);
        doc.text(`Page ${i} of ${pageCount}`, pageWidth - 20, doc.internal.pageSize.getHeight() - 10);
        doc.text("VineChMS - Member Report", 14, doc.internal.pageSize.getHeight() - 10);
      }

      doc.save(`my-report-${new Date().toISOString().split("T")[0]}.pdf`);
    } catch (error) {
      console.error("PDF export failed:", error);
      alert("Failed to export PDF. Please try again.");
    } finally {
      setExporting(false);
    }
  };

  if (loading) {
    return (
      <div className="member-reports-loading">
        <div className="member-reports-loading-spinner"></div>
        <p>Loading reports...</p>
      </div>
    );
  }

  return (
    <div className="member-reports-page">
      <div className="member-reports-header">
        <div>
          <h2 className="member-reports-title">My Reports</h2>
          <p className="member-reports-subtitle">View and export your church activity summary</p>
        </div>
        <div className="member-reports-actions">
          <button className="member-reports-refresh-btn" onClick={loadData}>
            <FiRefreshCw size={16} />
            Refresh
          </button>
          <button
            className="member-reports-export-btn"
            onClick={exportPDF}
            disabled={exporting}
          >
            <FiDownload size={16} />
            {exporting ? "Exporting..." : "Export PDF"}
          </button>
        </div>
      </div>

      <div className="member-reports-date-range">
        <div className="member-reports-date-group">
          <label>From</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>
        <div className="member-reports-date-group">
          <label>To</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
        <button className="member-reports-apply-btn" onClick={loadData}>
          Apply
        </button>
      </div>

      <div className="member-reports-summary-grid">
        <div className="member-reports-summary-card">
          <div className="member-reports-summary-card-icon" style={{ background: "#2E7D3215", color: "#2E7D32" }}>
            <FiDollarSign size={24} />
          </div>
          <div className="member-reports-summary-card-content">
            <h3 className="member-reports-summary-card-value">{formatCurrency(stats.giving.total)}</h3>
            <p className="member-reports-summary-card-title">Total Giving</p>
            <p className="member-reports-summary-card-subtitle">{stats.giving.count} records</p>
          </div>
        </div>
        <div className="member-reports-summary-card">
          <div className="member-reports-summary-card-icon" style={{ background: "#1565C015", color: "#1565C0" }}>
            <FiTrendingUp size={24} />
          </div>
          <div className="member-reports-summary-card-content">
            <h3 className="member-reports-summary-card-value">{stats.attendance.rate}%</h3>
            <p className="member-reports-summary-card-title">Attendance Rate</p>
            <p className="member-reports-summary-card-subtitle">{stats.attendance.present} present / {stats.attendance.total} total</p>
          </div>
        </div>
        <div className="member-reports-summary-card">
          <div className="member-reports-summary-card-icon" style={{ background: "#7C3AED15", color: "#7C3AED" }}>
            <FiUsers size={24} />
          </div>
          <div className="member-reports-summary-card-content">
            <h3 className="member-reports-summary-card-value">{stats.prayerRequests.total}</h3>
            <p className="member-reports-summary-card-title">Prayer Requests</p>
            <p className="member-reports-summary-card-subtitle">{stats.prayerRequests.byStatus.length} statuses</p>
          </div>
        </div>
        <div className="member-reports-summary-card">
          <div className="member-reports-summary-card-icon" style={{ background: "#DC262615", color: "#DC2626" }}>
            <FiCalendar size={24} />
          </div>
          <div className="member-reports-summary-card-content">
            <h3 className="member-reports-summary-card-value">{stats.events.registered}</h3>
            <p className="member-reports-summary-card-title">Events Registered</p>
            <p className="member-reports-summary-card-subtitle">{stats.events.attended} attended</p>
          </div>
        </div>
        <div className="member-reports-summary-card">
          <div className="member-reports-summary-card-icon" style={{ background: "#F59E0B15", color: "#F59E0B" }}>
            <FiBook size={24} />
          </div>
          <div className="member-reports-summary-card-content">
            <h3 className="member-reports-summary-card-value">{stats.services.attended}</h3>
            <p className="member-reports-summary-card-title">Services Attended</p>
            <p className="member-reports-summary-card-subtitle">{stats.services.total} total service sessions</p>
          </div>
        </div>
      </div>

      <div className="member-reports-details-grid">
        <div className="member-reports-detail-card">
          <h4 className="member-reports-detail-title">Giving by Type</h4>
          {stats.giving.byType.length > 0 ? (
            <div className="member-reports-detail-list">
              {stats.giving.byType.map((item, idx) => (
                <div key={idx} className="member-reports-detail-item">
                  <span className="member-reports-detail-label">{item.type}</span>
                  <span className="member-reports-detail-value">{formatCurrency(item.amount)}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="member-reports-no-data">No giving data</p>
          )}
        </div>
        <div className="member-reports-detail-card">
          <h4 className="member-reports-detail-title">Prayer Requests by Status</h4>
          {stats.prayerRequests.byStatus.length > 0 ? (
            <div className="member-reports-detail-list">
              {stats.prayerRequests.byStatus.map((item, idx) => (
                <div key={idx} className="member-reports-detail-item">
                  <span className="member-reports-detail-label">{item.status}</span>
                  <span className="member-reports-detail-value">{item.count}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="member-reports-no-data">No prayer requests</p>
          )}
        </div>
        <div className="member-reports-detail-card">
          <h4 className="member-reports-detail-title">Attendance Summary</h4>
          <div className="member-reports-detail-list">
            <div className="member-reports-detail-item">
              <span className="member-reports-detail-label">Total</span>
              <span className="member-reports-detail-value">{stats.attendance.total}</span>
            </div>
            <div className="member-reports-detail-item">
              <span className="member-reports-detail-label">Present</span>
              <span className="member-reports-detail-value">{stats.attendance.present}</span>
            </div>
            <div className="member-reports-detail-item">
              <span className="member-reports-detail-label">Absent</span>
              <span className="member-reports-detail-value">{stats.attendance.absent}</span>
            </div>
            <div className="member-reports-detail-item">
              <span className="member-reports-detail-label">Rate</span>
              <span className="member-reports-detail-value">{stats.attendance.rate}%</span>
            </div>
            <div className="member-reports-detail-item">
              <span className="member-reports-detail-label">Services Attended</span>
              <span className="member-reports-detail-value">{stats.services.attended}</span>
            </div>
          </div>
        </div>
        <div className="member-reports-detail-card">
          <h4 className="member-reports-detail-title">Group & Event Summary</h4>
          <div className="member-reports-detail-list">
            <div className="member-reports-detail-item">
              <span className="member-reports-detail-label">Total Groups</span>
              <span className="member-reports-detail-value">{stats.groups.total}</span>
            </div>
            <div className="member-reports-detail-item">
              <span className="member-reports-detail-label">Active Groups</span>
              <span className="member-reports-detail-value">{stats.groups.active}</span>
            </div>
            <div className="member-reports-detail-item">
              <span className="member-reports-detail-label">Events Registered</span>
              <span className="member-reports-detail-value">{stats.events.registered}</span>
            </div>
            <div className="member-reports-detail-item">
              <span className="member-reports-detail-label">Events Attended</span>
              <span className="member-reports-detail-value">{stats.events.attended}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}