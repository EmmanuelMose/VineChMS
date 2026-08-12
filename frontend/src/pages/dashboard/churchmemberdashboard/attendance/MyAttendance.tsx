import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { fetchAttendanceByMember, createAttendance, updateAttendance, deleteAttendance, type Attendance } from "../../../../Features/attendance/attendanceAPI";
import { fetchServices, type Service } from "../../../../Features/services/servicesAPI";
import { fetchMemberByUserId } from "../../../../Features/members/membersAPI";
import { fetchMemberEventRegistrations, updateEventRegistration, type EventRegistration } from "../../../../Features/events/eventsAPI";
import "./MyAttendance.css";

type AttendanceTab = 'services' | 'events';

export default function MyAttendance() {
  const token = useSelector((state: any) => state.user.token);
  const churchId = useSelector((state: any) => state.user.user?.churchId);
  const userId = useSelector((state: any) => state.user.user?.userId);

  const [activeTab, setActiveTab] = useState<AttendanceTab>('services');
  const [services, setServices] = useState<Service[]>([]);
  const [memberId, setMemberId] = useState<number | null>(null);
  
  // Service attendance state
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [loadingServices, setLoadingServices] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterService, setFilterService] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [filteredAttendance, setFilteredAttendance] = useState<Attendance[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingRecord, setEditingRecord] = useState<Attendance | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);

  // Event attendance state
  const [eventRegistrations, setEventRegistrations] = useState<EventRegistration[]>([]);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [eventSearchTerm, setEventSearchTerm] = useState("");
  const [filterEventStatus, setFilterEventStatus] = useState("all");
  const [eventStartDate, setEventStartDate] = useState("");
  const [eventEndDate, setEventEndDate] = useState("");
  const [filteredEventRegistrations, setFilteredEventRegistrations] = useState<EventRegistration[]>([]);
  const [processingEventId, setProcessingEventId] = useState<number | null>(null);

  const [formData, setFormData] = useState({
    serviceId: "",
    date: new Date().toISOString().split("T")[0],
    attended: true,
    checkInTime: "",
    checkOutTime: "",
    notes: "",
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
      loadServiceData();
      loadEventData();
    }
  }, [memberId]);

  // Service attendance filters
  useEffect(() => {
    filterServiceAttendance();
  }, [attendance, searchTerm, filterService, filterStatus, startDate, endDate]);

  // Event attendance filters
  useEffect(() => {
    filterEventAttendance();
  }, [eventRegistrations, eventSearchTerm, filterEventStatus, eventStartDate, eventEndDate]);

  const loadServiceData = async () => {
    if (!memberId || !token) return;
    try {
      setLoadingServices(true);
      const [attendanceData, servicesData] = await Promise.all([
        fetchAttendanceByMember(memberId, token),
        fetchServices(token),
      ]);
      const churchServices = servicesData.filter((s) => s.churchId === churchId);
      setAttendance(attendanceData);
      setServices(churchServices);
    } catch (error) {
      console.error("Failed to load service attendance:", error);
    } finally {
      setLoadingServices(false);
    }
  };

  const loadEventData = async () => {
    if (!memberId || !token) return;
    try {
      setLoadingEvents(true);
      const registrations = await fetchMemberEventRegistrations(memberId, token);
      setEventRegistrations(registrations);
    } catch (error) {
      console.error("Failed to load event registrations:", error);
    } finally {
      setLoadingEvents(false);
    }
  };

  const filterServiceAttendance = () => {
    let filtered = [...attendance];
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (a) =>
          (a.fullName || "").toLowerCase().includes(term) ||
          (a.serviceName || "").toLowerCase().includes(term) ||
          (a.notes || "").toLowerCase().includes(term)
      );
    }
    if (filterService !== "all") {
      filtered = filtered.filter((a) => a.serviceId === parseInt(filterService));
    }
    if (filterStatus === "present") {
      filtered = filtered.filter((a) => a.attended);
    } else if (filterStatus === "absent") {
      filtered = filtered.filter((a) => !a.attended);
    }
    if (startDate) {
      const start = new Date(startDate);
      start.setHours(0, 0, 0, 0);
      filtered = filtered.filter((a) => new Date(a.date) >= start);
    }
    if (endDate) {
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      filtered = filtered.filter((a) => new Date(a.date) <= end);
    }
    setFilteredAttendance(filtered);
  };

  const filterEventAttendance = () => {
    let filtered = [...eventRegistrations];
    if (eventSearchTerm.trim()) {
      const term = eventSearchTerm.toLowerCase();
      filtered = filtered.filter(
        (r) =>
          (r.eventTitle || "").toLowerCase().includes(term) ||
          (r.fullName || "").toLowerCase().includes(term) ||
          (r.notes || "").toLowerCase().includes(term)
      );
    }
    if (filterEventStatus === "attended") {
      filtered = filtered.filter((r) => r.attended);
    } else if (filterEventStatus === "not-attended") {
      filtered = filtered.filter((r) => !r.attended);
    }
    if (eventStartDate) {
      const start = new Date(eventStartDate);
      start.setHours(0, 0, 0, 0);
      filtered = filtered.filter((r) => new Date(r.eventStartDate || r.createdAt) >= start);
    }
    if (eventEndDate) {
      const end = new Date(eventEndDate);
      end.setHours(23, 59, 59, 999);
      filtered = filtered.filter((r) => new Date(r.eventStartDate || r.createdAt) <= end);
    }
    setFilteredEventRegistrations(filtered);
  };

  const clearFilters = (type: 'services' | 'events') => {
    if (type === 'services') {
      setSearchTerm("");
      setFilterService("all");
      setFilterStatus("all");
      setStartDate("");
      setEndDate("");
    } else {
      setEventSearchTerm("");
      setFilterEventStatus("all");
      setEventStartDate("");
      setEventEndDate("");
    }
  };

  const getServiceName = (serviceId: number) => {
    const service = services.find((s) => s.serviceId === serviceId);
    return service ? service.name : "Unknown Service";
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatTime = (timeString?: string) => {
    if (!timeString) return "—";
    return new Date(timeString).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleEdit = (record: Attendance) => {
    setEditingRecord(record);
    const date = new Date(record.date);
    setFormData({
      serviceId: record.serviceId.toString(),
      date: date.toISOString().split("T")[0],
      attended: record.attended,
      checkInTime: record.checkInTime ? new Date(record.checkInTime).toTimeString().slice(0, 5) : "",
      checkOutTime: record.checkOutTime ? new Date(record.checkOutTime).toTimeString().slice(0, 5) : "",
      notes: record.notes || "",
    });
    setShowModal(true);
  };

  const handleCreate = () => {
    setEditingRecord(null);
    setFormData({
      serviceId: "",
      date: new Date().toISOString().split("T")[0],
      attended: true,
      checkInTime: "",
      checkOutTime: "",
      notes: "",
    });
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!memberId) return;
    setSubmitting(true);
    try {
      const dateObj = new Date(formData.date);
      let checkInTime = null;
      if (formData.checkInTime) {
        const [hours, minutes] = formData.checkInTime.split(":").map(Number);
        const checkIn = new Date(dateObj);
        checkIn.setHours(hours, minutes, 0, 0);
        checkInTime = checkIn.toISOString();
      }
      let checkOutTime = null;
      if (formData.checkOutTime) {
        const [hours, minutes] = formData.checkOutTime.split(":").map(Number);
        const checkOut = new Date(dateObj);
        checkOut.setHours(hours, minutes, 0, 0);
        checkOutTime = checkOut.toISOString();
      }

      if (editingRecord) {
        await updateAttendance(
          editingRecord.attendanceId,
          {
            serviceId: parseInt(formData.serviceId),
            date: dateObj.toISOString(),
            attended: formData.attended,
            checkInTime: checkInTime || undefined,
            checkOutTime: checkOutTime || undefined,
            notes: formData.notes || undefined,
          },
          token
        );
      } else {
        await createAttendance(
          {
            memberId: memberId,
            serviceId: parseInt(formData.serviceId),
            date: dateObj.toISOString(),
            attended: formData.attended,
            checkInTime: checkInTime || undefined,
            checkOutTime: checkOutTime || undefined,
            notes: formData.notes || undefined,
          },
          token
        );
      }
      setShowModal(false);
      await loadServiceData();
    } catch (error: any) {
      console.error("Failed to save attendance:", error);
      alert(error.response?.data?.message || "Failed to save attendance record.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTargetId) return;
    try {
      await deleteAttendance(deleteTargetId, token);
      setShowDeleteModal(false);
      setDeleteTargetId(null);
      await loadServiceData();
    } catch (error) {
      console.error("Failed to delete attendance:", error);
      alert("Failed to delete attendance record.");
    }
  };

  const handleToggleEventAttendance = async (registrationId: number, currentStatus: boolean) => {
    setProcessingEventId(registrationId);
    try {
      await updateEventRegistration(registrationId, { attended: !currentStatus }, token);
      await loadEventData();
    } catch (error) {
      console.error("Failed to update event attendance:", error);
      alert("Failed to update event attendance.");
    } finally {
      setProcessingEventId(null);
    }
  };

  const hasServiceFilters = !!(searchTerm || filterService !== "all" || filterStatus !== "all" || startDate || endDate);
  const hasEventFilters = !!(eventSearchTerm || filterEventStatus !== "all" || eventStartDate || eventEndDate);

  if (loadingServices && loadingEvents) {
    return (
      <div className="member-attendance-loading">
        <div className="member-attendance-loading-spinner"></div>
        <p>Loading attendance...</p>
      </div>
    );
  }

  return (
    <div className="member-attendance-page">
      <div className="member-attendance-header">
        <div>
          <h2 className="member-attendance-title">My Attendance</h2>
          <p className="member-attendance-subtitle">Track your service and event attendance</p>
        </div>
        <button className="member-attendance-add-btn" onClick={handleCreate}>
          Record Service Attendance
        </button>
      </div>

      <div className="member-attendance-tabs">
        <button
          className={`member-attendance-tab ${activeTab === 'services' ? 'active' : ''}`}
          onClick={() => setActiveTab('services')}
        >
          Services
        </button>
        <button
          className={`member-attendance-tab ${activeTab === 'events' ? 'active' : ''}`}
          onClick={() => setActiveTab('events')}
        >
          Events
        </button>
      </div>

      {activeTab === 'services' && (
        <>
          <div className="member-attendance-stats">
            <div className="member-attendance-stat">
              <span className="member-attendance-stat-value">{attendance.length}</span>
              <span className="member-attendance-stat-label">Total Records</span>
            </div>
            <div className="member-attendance-stat">
              <span className="member-attendance-stat-value">{attendance.filter(a => a.attended).length}</span>
              <span className="member-attendance-stat-label">Present</span>
            </div>
            <div className="member-attendance-stat">
              <span className="member-attendance-stat-value">{attendance.filter(a => !a.attended).length}</span>
              <span className="member-attendance-stat-label">Absent</span>
            </div>
            <div className="member-attendance-stat">
              <span className="member-attendance-stat-value">
                {attendance.length > 0 ? Math.round((attendance.filter(a => a.attended).length / attendance.length) * 100) : 0}%
              </span>
              <span className="member-attendance-stat-label">Rate</span>
            </div>
          </div>

          <div className="member-attendance-filters">
            <div className="member-attendance-filter-group">
              <label>Search</label>
              <input
                type="text"
                placeholder="Search by service or notes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="member-attendance-filter-group">
              <label>Service</label>
              <select
                value={filterService}
                onChange={(e) => setFilterService(e.target.value)}
              >
                <option value="all">All Services</option>
                {services.map((s) => (
                  <option key={s.serviceId} value={s.serviceId}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="member-attendance-filter-group">
              <label>Status</label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">All</option>
                <option value="present">Present</option>
                <option value="absent">Absent</option>
              </select>
            </div>
            <div className="member-attendance-filter-group">
              <label>From</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div className="member-attendance-filter-group">
              <label>To</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
            {hasServiceFilters && (
              <button className="member-attendance-clear-btn" onClick={() => clearFilters('services')}>
                Clear Filters
              </button>
            )}
          </div>

          <div className="member-attendance-table-wrapper">
            {filteredAttendance.length > 0 ? (
              <table className="member-attendance-table">
                <thead>
                  <tr>
                    <th>Service</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Check In</th>
                    <th>Check Out</th>
                    <th>Notes</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAttendance.map((record) => (
                    <tr key={record.attendanceId}>
                      <td>{getServiceName(record.serviceId)}</td>
                      <td>{formatDate(record.date)}</td>
                      <td>
                        <span className={`member-attendance-status ${record.attended ? "status-present" : "status-absent"}`}>
                          {record.attended ? "Present" : "Absent"}
                        </span>
                      </td>
                      <td>{formatTime(record.checkInTime)}</td>
                      <td>{formatTime(record.checkOutTime)}</td>
                      <td>{record.notes || "—"}</td>
                      <td>
                        <div className="member-attendance-actions">
                          <button className="member-attendance-action-edit" onClick={() => handleEdit(record)}>
                            Edit
                          </button>
                          <button
                            className="member-attendance-action-delete"
                            onClick={() => {
                              setDeleteTargetId(record.attendanceId);
                              setShowDeleteModal(true);
                            }}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="member-attendance-empty">
                <p>No service attendance records found</p>
                <span>Record your first attendance</span>
              </div>
            )}
          </div>
        </>
      )}

      {activeTab === 'events' && (
        <>
          <div className="member-attendance-stats">
            <div className="member-attendance-stat">
              <span className="member-attendance-stat-value">{eventRegistrations.length}</span>
              <span className="member-attendance-stat-label">Total Registrations</span>
            </div>
            <div className="member-attendance-stat">
              <span className="member-attendance-stat-value">{eventRegistrations.filter(r => r.attended).length}</span>
              <span className="member-attendance-stat-label">Attended</span>
            </div>
            <div className="member-attendance-stat">
              <span className="member-attendance-stat-value">{eventRegistrations.filter(r => !r.attended).length}</span>
              <span className="member-attendance-stat-label">Not Attended</span>
            </div>
          </div>

          <div className="member-attendance-filters">
            <div className="member-attendance-filter-group">
              <label>Search</label>
              <input
                type="text"
                placeholder="Search by event name..."
                value={eventSearchTerm}
                onChange={(e) => setEventSearchTerm(e.target.value)}
              />
            </div>
            <div className="member-attendance-filter-group">
              <label>Status</label>
              <select
                value={filterEventStatus}
                onChange={(e) => setFilterEventStatus(e.target.value)}
              >
                <option value="all">All</option>
                <option value="attended">Attended</option>
                <option value="not-attended">Not Attended</option>
              </select>
            </div>
            <div className="member-attendance-filter-group">
              <label>From</label>
              <input
                type="date"
                value={eventStartDate}
                onChange={(e) => setEventStartDate(e.target.value)}
              />
            </div>
            <div className="member-attendance-filter-group">
              <label>To</label>
              <input
                type="date"
                value={eventEndDate}
                onChange={(e) => setEventEndDate(e.target.value)}
              />
            </div>
            {hasEventFilters && (
              <button className="member-attendance-clear-btn" onClick={() => clearFilters('events')}>
                Clear Filters
              </button>
            )}
          </div>

          <div className="member-attendance-table-wrapper">
            {filteredEventRegistrations.length > 0 ? (
              <table className="member-attendance-table">
                <thead>
                  <tr>
                    <th>Event</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Notes</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEventRegistrations.map((reg) => (
                    <tr key={reg.registrationId}>
                      <td>{reg.eventTitle || "Unknown Event"}</td>
                      <td>{formatDate(reg.eventStartDate || reg.createdAt)}</td>
                      <td>
                        <span className={`member-attendance-status ${reg.attended ? "status-present" : "status-absent"}`}>
                          {reg.attended ? "Attended" : "Not Attended"}
                        </span>
                      </td>
                      <td>{reg.notes || "—"}</td>
                      <td>
                        <div className="member-attendance-actions">
                          <button
                            className={`member-attendance-action-toggle ${reg.attended ? "toggle-attended" : "toggle-not-attended"}`}
                            onClick={() => handleToggleEventAttendance(reg.registrationId, reg.attended)}
                            disabled={processingEventId === reg.registrationId}
                          >
                            {processingEventId === reg.registrationId ? "..." : reg.attended ? "Mark Not Attended" : "Mark Attended"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="member-attendance-empty">
                <p>No event registrations found</p>
                <span>Register for events to track attendance</span>
              </div>
            )}
          </div>
        </>
      )}

      {showModal && (
        <div className="member-attendance-modal-overlay" onClick={() => setShowModal(false)}>
          <div className="member-attendance-modal" onClick={(e) => e.stopPropagation()}>
            <div className="member-attendance-modal-header">
              <h3>{editingRecord ? "Edit Attendance" : "Record Attendance"}</h3>
              <button className="member-attendance-modal-close" onClick={() => setShowModal(false)}>
                Close
              </button>
            </div>
            <form onSubmit={handleSubmit} className="member-attendance-modal-form">
              <div className="member-attendance-form-group">
                <label>Service</label>
                <select
                  value={formData.serviceId}
                  onChange={(e) => setFormData({ ...formData, serviceId: e.target.value })}
                  required
                >
                  <option value="">Select a service</option>
                  {services.filter(s => s.isActive).map((s) => (
                    <option key={s.serviceId} value={s.serviceId}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="member-attendance-form-group">
                <label>Date</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  required
                />
              </div>
              <div className="member-attendance-form-row">
                <div className="member-attendance-form-group">
                  <label>Check In Time</label>
                  <input
                    type="time"
                    value={formData.checkInTime}
                    onChange={(e) => setFormData({ ...formData, checkInTime: e.target.value })}
                  />
                </div>
                <div className="member-attendance-form-group">
                  <label>Check Out Time</label>
                  <input
                    type="time"
                    value={formData.checkOutTime}
                    onChange={(e) => setFormData({ ...formData, checkOutTime: e.target.value })}
                  />
                </div>
              </div>
              <div className="member-attendance-form-group">
                <label>Attendance</label>
                <div className="member-attendance-checkbox-group">
                  <label>
                    <input
                      type="checkbox"
                      checked={formData.attended}
                      onChange={(e) => setFormData({ ...formData, attended: e.target.checked })}
                    />
                    Attended
                  </label>
                </div>
              </div>
              <div className="member-attendance-form-group">
                <label>Notes</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={2}
                  placeholder="Additional notes..."
                />
              </div>
              <div className="member-attendance-modal-actions">
                <button
                  type="button"
                  className="member-attendance-modal-cancel"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="member-attendance-modal-submit"
                  disabled={submitting}
                >
                  {submitting ? "Saving..." : editingRecord ? "Update" : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showDeleteModal && (
        <div className="member-attendance-modal-overlay" onClick={() => setShowDeleteModal(false)}>
          <div className="member-attendance-modal member-attendance-modal-small" onClick={(e) => e.stopPropagation()}>
            <div className="member-attendance-modal-header">
              <h3>Delete Record</h3>
              <button className="member-attendance-modal-close" onClick={() => setShowDeleteModal(false)}>
                Close
              </button>
            </div>
            <div className="member-attendance-modal-body">
              <p>Are you sure you want to delete this attendance record?</p>
              <p className="member-attendance-modal-warning">This action cannot be undone.</p>
            </div>
            <div className="member-attendance-modal-actions">
              <button className="member-attendance-modal-cancel" onClick={() => setShowDeleteModal(false)}>
                Cancel
              </button>
              <button className="member-attendance-modal-danger" onClick={handleDelete}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}