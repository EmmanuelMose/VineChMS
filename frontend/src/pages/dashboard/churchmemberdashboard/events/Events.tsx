import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { 
  FiSearch, FiX, FiCalendar, FiMapPin, FiUsers, 
  FiPlus, FiCheckCircle, FiXCircle, FiDownload, 
  FiRefreshCw, FiClock, FiEdit2, FiTrash2
} from "react-icons/fi";
import { fetchEvents, registerForEvent, updateEventRegistration, deleteEventRegistration, fetchMemberEventRegistrations, deleteEvent, type Event, type EventRegistration } from "../../../../Features/events/eventsAPI";
import { fetchMemberByUserId } from "../../../../Features/members/membersAPI";
import CreateEvent from "./CreateEvent";
import UpdateEvent from "./UpdateEvent";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import "./Events.css";

export default function Events() {
  const token = useSelector((state: any) => state.user.token);
  const churchId = useSelector((state: any) => state.user.user?.churchId);
  const userId = useSelector((state: any) => state.user.user?.userId);
  const userRole = useSelector((state: any) => state.user.user?.role);
  
  const [events, setEvents] = useState<Event[]>([]);
  const [registrations, setRegistrations] = useState<EventRegistration[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [processingId, setProcessingId] = useState<number | null>(null);
  const [memberId, setMemberId] = useState<number | null>(null);
  
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);

  const canManageEvents = userRole === "secretary" || userRole === "church_admin" || userRole === "pastor" || userRole === "elder";

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
      loadAllData();
    }
  }, [memberId]);

  useEffect(() => {
    filterEvents();
  }, [events, registrations, searchTerm, filterStatus, startDate, endDate]);

  const loadAllData = async () => {
    if (!memberId || !token) return;
    try {
      setLoading(true);
      const [eventsData, registrationsData] = await Promise.all([
        fetchEvents(token),
        fetchMemberEventRegistrations(memberId!, token)
      ]);
      const churchEvents = eventsData.filter(
        (e: any) => e.churchId === churchId
      );
      setEvents(churchEvents);
      setRegistrations(registrationsData);
    } catch (error) {
      console.error("Failed to load data:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterEvents = () => {
    let filtered = [...events];

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (e) =>
          e.title.toLowerCase().includes(term) ||
          (e.description || "").toLowerCase().includes(term) ||
          (e.location || "").toLowerCase().includes(term)
      );
    }

    if (filterStatus !== "all") {
      filtered = filtered.filter((e) => e.status === filterStatus);
    }

    if (startDate) {
      const start = new Date(startDate);
      start.setHours(0, 0, 0, 0);
      filtered = filtered.filter((e) => new Date(e.startDate) >= start);
    }

    if (endDate) {
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      filtered = filtered.filter((e) => new Date(e.startDate) <= end);
    }

    setFilteredEvents(filtered);
  };

  const clearDateFilters = () => {
    setStartDate("");
    setEndDate("");
  };

  const isRegistered = (eventId: number) => {
    return registrations.some(r => r.eventId === eventId);
  };

  const getRegistration = (eventId: number) => {
    return registrations.find(r => r.eventId === eventId) || null;
  };

  const handleRegister = async (eventId: number) => {
    if (!memberId) {
      alert("Member ID not found. Please refresh and try again.");
      return;
    }

    setProcessingId(eventId);
    try {
      await registerForEvent({
        eventId: eventId,
        memberId: memberId,
        attended: false,
      }, token);
      const updatedRegistrations = await fetchMemberEventRegistrations(memberId!, token);
      setRegistrations(updatedRegistrations);
    } catch (error: any) {
      console.error("Failed to register for event:", error);
      if (error.response) {
        const msg = error.response.data?.message || "Registration failed.";
        if (msg.toLowerCase().includes("already registered") || msg.toLowerCase().includes("duplicate")) {
          alert("You are already registered for this event.");
          const updatedRegistrations = await fetchMemberEventRegistrations(memberId!, token);
          setRegistrations(updatedRegistrations);
        } else {
          alert(msg);
        }
      } else {
        alert("Failed to register. Please try again.");
      }
    } finally {
      setProcessingId(null);
    }
  };

  const handleUnregister = async (eventId: number) => {
    if (!window.confirm("Are you sure you want to unregister from this event?")) return;
    setProcessingId(eventId);
    try {
      const reg = getRegistration(eventId);
      if (reg) {
        await deleteEventRegistration(reg.registrationId, token);
        const updatedRegistrations = await fetchMemberEventRegistrations(memberId!, token);
        setRegistrations(updatedRegistrations);
      }
    } catch (error: any) {
      console.error("Failed to unregister:", error);
      alert(error.response?.data?.message || "Failed to unregister. Please try again.");
    } finally {
      setProcessingId(null);
    }
  };

  const handleMarkAttendance = async (eventId: number, currentStatus: boolean) => {
    if (!memberId) {
      alert("Member ID not found. Please refresh and try again.");
      return;
    }
    setProcessingId(eventId);
    try {
      const reg = getRegistration(eventId);
      if (reg) {
        await updateEventRegistration(reg.registrationId, { attended: !currentStatus }, token);
        const updatedRegistrations = await fetchMemberEventRegistrations(memberId!, token);
        setRegistrations(updatedRegistrations);
      }
    } catch (error: any) {
      console.error("Failed to update attendance:", error);
      alert(error.response?.data?.message || "Failed to update attendance. Please try again.");
    } finally {
      setProcessingId(null);
    }
  };

  const handleEdit = (event: Event) => {
    setEditingEvent(event);
    setShowUpdateModal(true);
  };

  const handleDeleteClick = (id: number) => {
    setDeleteTargetId(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (deleteTargetId) {
      try {
        await deleteEvent(deleteTargetId, token);
        await loadAllData();
        setShowDeleteModal(false);
        setDeleteTargetId(null);
      } catch (error) {
        console.error("Failed to delete event:", error);
        alert("Failed to delete event.");
      }
    }
  };

  const handleSuccess = () => {
    loadAllData();
    setShowCreateModal(false);
    setShowUpdateModal(false);
    setEditingEvent(null);
  };

  const handleDownloadPDF = () => {
    if (filteredEvents.length === 0) {
      alert("No events to download for the selected filters.");
      return;
    }

    const doc = new jsPDF("p", "mm", "a4");
    const pageWidth = doc.internal.pageSize.getWidth();

    doc.setFontSize(18);
    doc.setTextColor(21, 101, 192);
    doc.text("Church Events", pageWidth / 2, 20, { align: "center" });

    doc.setFontSize(10);
    doc.setTextColor(100);
    const dateStr = new Date().toLocaleString();
    doc.text(`Generated: ${dateStr}`, pageWidth / 2, 28, { align: "center" });
    doc.text(`Church ID: ${churchId}`, pageWidth / 2, 34, { align: "center" });

    let dateRangeText = "";
    if (startDate && endDate) {
      dateRangeText = ` (${startDate} to ${endDate})`;
    } else if (startDate) {
      dateRangeText = ` (from ${startDate})`;
    } else if (endDate) {
      dateRangeText = ` (until ${endDate})`;
    }
    if (dateRangeText) {
      doc.text(`Date Range: ${dateRangeText}`, pageWidth / 2, 40, { align: "center" });
    }

    const tableData = filteredEvents.map((e) => [
      e.title,
      e.location || "N/A",
      new Date(e.startDate).toLocaleDateString(),
      e.status,
      e.maxAttendees ? `${e.maxAttendees}` : "Unlimited",
    ]);

    autoTable(doc, {
      head: [["Title", "Location", "Date", "Status", "Max Attendees"]],
      body: tableData,
      startY: dateRangeText ? 48 : 42,
      styles: { fontSize: 9 },
      headStyles: { fillColor: [21, 101, 192], textColor: [255, 255, 255] },
      alternateRowStyles: { fillColor: [240, 244, 248] },
      margin: { left: 14, right: 14 },
    });

    doc.save("events.pdf");
  };

  const isUpcoming = (date: string) => {
    return new Date(date) > new Date();
  };

  if (loading) {
    return (
      <div className="member-events-loading">
        <div className="member-events-loading-spinner"></div>
        <p>Loading events...</p>
      </div>
    );
  }

  const hasActiveFilters = !!(searchTerm || filterStatus !== "all" || startDate || endDate);

  return (
    <div className="member-events-page">
      <CreateEvent
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={handleSuccess}
      />

      {editingEvent && (
        <UpdateEvent
          isOpen={showUpdateModal}
          onClose={() => {
            setShowUpdateModal(false);
            setEditingEvent(null);
          }}
          onSuccess={handleSuccess}
          event={editingEvent}
        />
      )}

      {showDeleteModal && (
        <div className="member-events-modal-overlay" onClick={() => setShowDeleteModal(false)}>
          <div className="member-events-modal" onClick={(e) => e.stopPropagation()}>
            <div className="member-events-modal-header">
              <h3>Delete Event</h3>
              <button className="member-events-modal-close" onClick={() => setShowDeleteModal(false)}>
                Close
              </button>
            </div>
            <div className="member-events-modal-body">
              <p>Are you sure you want to delete this event?</p>
              <p className="member-events-modal-warning">This action cannot be undone.</p>
            </div>
            <div className="member-events-modal-actions">
              <button className="member-events-modal-cancel" onClick={() => setShowDeleteModal(false)}>
                Cancel
              </button>
              <button className="member-events-modal-danger" onClick={confirmDelete}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="member-events-header">
        <div>
          <h2 className="member-events-title">Events</h2>
          <p className="member-events-subtitle">Discover and register for church events</p>
        </div>
        <div className="member-events-actions">
          {canManageEvents && (
            <button className="member-events-add-btn" onClick={() => setShowCreateModal(true)}>
              <FiPlus size={18} />
              Create Event
            </button>
          )}
          <button
            onClick={handleDownloadPDF}
            className="member-events-btn-download"
            disabled={filteredEvents.length === 0}
          >
            <FiDownload size={16} />
            Download PDF
          </button>
        </div>
      </div>

      <div className="member-events-toolbar">
        <div className="member-events-search">
          <FiSearch className="member-events-search-icon" />
          <input
            type="text"
            placeholder="Search events..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="member-events-search-input"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="member-events-search-clear"
            >
              <FiX size={16} />
            </button>
          )}
        </div>
        <div className="member-events-filters">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="member-events-filter-select"
          >
            <option value="all">All Events</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
            <option value="cancelled">Cancelled</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </div>

      <div className="member-events-date-filters">
        <div className="member-events-date-group">
          <label>From Date</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="member-events-date-input"
          />
        </div>
        <div className="member-events-date-group">
          <label>To Date</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="member-events-date-input"
          />
        </div>
        {(startDate || endDate) && (
          <button
            onClick={clearDateFilters}
            className="member-events-clear-filters"
          >
            <FiRefreshCw size={14} />
            Clear Dates
          </button>
        )}
      </div>

      <div className="member-events-grid">
        {filteredEvents.length > 0 ? (
          filteredEvents.map((event) => {
            const registered = isRegistered(event.eventId);
            const registration = getRegistration(event.eventId);
            const isUpcomingEvent = isUpcoming(event.startDate);
            const isCompleted = event.status === "completed";
            const isCancelled = event.status === "cancelled";

            return (
              <div key={event.eventId} className="member-events-card">
                {event.coverImageUrl && (
                  <div className="member-events-card-image">
                    <img src={event.coverImageUrl} alt={event.title} />
                  </div>
                )}
                <div className="member-events-card-content">
                  <div className="member-events-card-header">
                    <div className="member-events-card-title-section">
                      <h3 className="member-events-card-title">{event.title}</h3>
                      <span className={`member-events-card-status status-${event.status}`}>
                        {event.status}
                      </span>
                    </div>
                    <div className="member-events-card-actions">
                      {!isCancelled && !isCompleted && (
                        <>
                          {!registered ? (
                            <button
                              onClick={() => handleRegister(event.eventId)}
                              className="member-events-btn-register"
                              disabled={processingId === event.eventId}
                            >
                              <FiPlus size={14} />
                              {processingId === event.eventId ? "..." : "Register"}
                            </button>
                          ) : (
                            <>
                              <button
                                onClick={() => handleMarkAttendance(event.eventId, registration?.attended || false)}
                                className={`member-events-btn-attendance ${registration?.attended ? "attended" : ""}`}
                                disabled={processingId === event.eventId}
                              >
                                {registration?.attended ? (
                                  <FiCheckCircle size={14} />
                                ) : (
                                  <FiClock size={14} />
                                )}
                                {registration?.attended ? "Attended" : "Mark Attendance"}
                              </button>
                              <button
                                onClick={() => handleUnregister(event.eventId)}
                                className="member-events-btn-unregister"
                                disabled={processingId === event.eventId}
                              >
                                <FiXCircle size={14} />
                                Cancel
                              </button>
                            </>
                          )}
                        </>
                      )}
                      {(isCompleted || isCancelled) && (
                        <span className="member-events-badge-completed">
                          {isCompleted ? "Completed" : "Cancelled"}
                        </span>
                      )}
                      {canManageEvents && !isCompleted && !isCancelled && (
                        <>
                          <button
                            className="member-events-btn-edit"
                            onClick={() => handleEdit(event)}
                          >
                            <FiEdit2 size={14} /> Edit
                          </button>
                          <button
                            className="member-events-btn-delete"
                            onClick={() => handleDeleteClick(event.eventId)}
                          >
                            <FiTrash2 size={14} /> Delete
                          </button>
                        </>
                      )}
                    </div>
                  </div>

                  {event.description && (
                    <p className="member-events-card-description">{event.description}</p>
                  )}

                  <div className="member-events-card-details">
                    <div className="member-events-card-detail">
                      <FiCalendar size={14} />
                      <span>{new Date(event.startDate).toLocaleDateString()}</span>
                      {event.endDate && (
                        <span> - {new Date(event.endDate).toLocaleDateString()}</span>
                      )}
                    </div>
                    {event.location && (
                      <div className="member-events-card-detail">
                        <FiMapPin size={14} />
                        <span>{event.location}</span>
                      </div>
                    )}
                    {event.maxAttendees && (
                      <div className="member-events-card-detail">
                        <FiUsers size={14} />
                        <span>Max {event.maxAttendees} attendees</span>
                      </div>
                    )}
                  </div>

                  {isUpcomingEvent && !isCompleted && !isCancelled && (
                    <div className="member-events-card-registration-status">
                      {registered ? (
                        <span className="member-events-registered">
                          <FiCheckCircle size={14} />
                          You are registered for this event
                        </span>
                      ) : (
                        <span className="member-events-not-registered">
                          <FiClock size={14} />
                          Not yet registered
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <div className="member-events-empty">
            <p>No events found</p>
          </div>
        )}
      </div>

      {filteredEvents.length > 0 && (
        <div className="member-events-count">
          Showing {filteredEvents.length} of {events.length} events
          {hasActiveFilters && " (filtered)"}
        </div>
      )}
    </div>
  );
}