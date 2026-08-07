import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { FiSearch, FiX, FiPlus, FiEdit2, FiTrash2, FiCalendar, FiMapPin, FiUsers, FiEye } from "react-icons/fi";
import { fetchEvents, deleteEvent, type Event } from "../../../../Features/events/eventsAPI";
import CreateEvent from "./CreateEvents";
import UpdateEvent from "./UpdateEvent";
import EventRegistrations from "./EventRegistration";
import "./Events.css";

export default function Events() {
  const token = useSelector((state: any) => state.user.token);
  const churchId = useSelector((state: any) => state.user.user?.churchId);
  
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [filterStatus, setFilterStatus] = useState("all");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);
  const [showRegistrations, setShowRegistrations] = useState(false);
  const [registrationEventId, setRegistrationEventId] = useState<number | null>(null);

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      setLoading(true);
      const data = await fetchEvents(token);
      const filtered = data.filter(e => e.churchId === churchId);
      setEvents(filtered);
    } catch (error) {
      console.error("Failed to load events:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (id: number) => {
    setDeleteTargetId(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (deleteTargetId) {
      try {
        await deleteEvent(deleteTargetId, token);
        await loadEvents();
        setShowDeleteModal(false);
        setDeleteTargetId(null);
      } catch (error) {
        console.error("Failed to delete event:", error);
      }
    }
  };

  const handleEdit = (event: Event) => {
    setSelectedEvent(event);
    setUpdateModalOpen(true);
  };

  const handleViewRegistrations = (eventId: number) => {
    setRegistrationEventId(eventId);
    setShowRegistrations(true);
  };

  const handleSuccess = () => {
    loadEvents();
    setCreateModalOpen(false);
    setUpdateModalOpen(false);
    setSelectedEvent(null);
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      draft: "status-draft",
      published: "status-published",
      cancelled: "status-cancelled",
      completed: "status-completed",
    };
    return colors[status] || "status-draft";
  };

  const filteredEvents = events.filter(event => {
    const matchesSearch = 
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (event.description || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (event.location || "").toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = 
      filterStatus === "all" ||
      event.status === filterStatus;
    
    return matchesSearch && matchesFilter;
  });

  const stats = {
    total: events.length,
    published: events.filter(e => e.status === "published").length,
    draft: events.filter(e => e.status === "draft").length,
    upcoming: events.filter(e => new Date(e.startDate) > new Date()).length,
  };

  if (loading) {
    return (
      <div className="events-loading">
        <div className="events-loading-spinner"></div>
        <p>Loading events...</p>
      </div>
    );
  }

  if (showRegistrations && registrationEventId) {
    return (
      <EventRegistrations
        eventId={registrationEventId}
        onBack={() => setShowRegistrations(false)}
        token={token}
      />
    );
  }

  return (
    <div className="events-page">
      {showDeleteModal && (
        <div className="events-modal-overlay" onClick={() => setShowDeleteModal(false)}>
          <div className="events-modal events-modal-confirm" onClick={(e) => e.stopPropagation()}>
            <div className="events-modal-header">
              <h3>Delete Event</h3>
              <button onClick={() => setShowDeleteModal(false)} className="events-modal-close">
                <FiX size={20} />
              </button>
            </div>
            <div className="events-modal-body">
              <p>Are you sure you want to permanently delete this event?</p>
              <p className="events-modal-warning">This action cannot be undone. All registrations will be removed.</p>
            </div>
            <div className="events-modal-actions">
              <button onClick={() => setShowDeleteModal(false)} className="events-btn-cancel">
                Cancel
              </button>
              <button onClick={confirmDelete} className="events-btn-danger">
                Delete Permanently
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="events-header">
        <div>
          <h2 className="events-title">Events</h2>
          <p className="events-subtitle">Manage church events and registrations</p>
        </div>
        <div className="events-actions">
          <button onClick={() => setCreateModalOpen(true)} className="events-btn-primary">
            <FiPlus size={16} />
            Create Event
          </button>
        </div>
      </div>

      <div className="events-stats-grid">
        <div className="events-stat-card stat-total">
          <span className="events-stat-value">{stats.total}</span>
          <span className="events-stat-label">Total Events</span>
        </div>
        <div className="events-stat-card stat-published">
          <span className="events-stat-value">{stats.published}</span>
          <span className="events-stat-label">Published</span>
        </div>
        <div className="events-stat-card stat-draft">
          <span className="events-stat-value">{stats.draft}</span>
          <span className="events-stat-label">Drafts</span>
        </div>
        <div className="events-stat-card stat-upcoming">
          <span className="events-stat-value">{stats.upcoming}</span>
          <span className="events-stat-label">Upcoming</span>
        </div>
      </div>

      <div className="events-toolbar">
        <div className="events-search">
          <FiSearch className="events-search-icon" />
          <input
            type="text"
            placeholder="Search events..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="events-search-input"
          />
          {searchTerm && (
            <button onClick={() => setSearchTerm("")} className="events-search-clear">
              <FiX size={16} />
            </button>
          )}
        </div>
        <div className="events-filters">
          <select 
            value={filterStatus} 
            onChange={(e) => setFilterStatus(e.target.value)}
            className="events-filter-select"
          >
            <option value="all">All Events</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
            <option value="cancelled">Cancelled</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </div>

      <div className="events-grid">
        {filteredEvents.map((event) => (
          <div key={event.eventId} className="events-card">
            {event.imageUrl && (
              <div className="events-card-image">
                <img src={event.imageUrl} alt={event.title} />
              </div>
            )}
            <div className="events-card-content">
              <div className="events-card-header">
                <h3 className="events-card-title">{event.title}</h3>
                <span className={`events-card-status ${getStatusColor(event.status)}`}>
                  {event.status}
                </span>
              </div>
              {event.description && (
                <p className="events-card-description">{event.description}</p>
              )}
              <div className="events-card-details">
                <div className="events-card-detail">
                  <FiCalendar size={14} />
                  <span>{new Date(event.startDate).toLocaleDateString()}</span>
                </div>
                {event.location && (
                  <div className="events-card-detail">
                    <FiMapPin size={14} />
                    <span>{event.location}</span>
                  </div>
                )}
                {event.maxAttendees && (
                  <div className="events-card-detail">
                    <FiUsers size={14} />
                    <span>Max {event.maxAttendees}</span>
                  </div>
                )}
              </div>
              <div className="events-card-actions">
                <button 
                  onClick={() => handleViewRegistrations(event.eventId)} 
                  className="events-card-btn events-btn-view"
                >
                  <FiEye size={14} />
                  Registrations
                </button>
                <button 
                  onClick={() => handleEdit(event)} 
                  className="events-card-btn events-btn-edit"
                >
                  <FiEdit2 size={14} />
                </button>
                <button 
                  onClick={() => handleDeleteClick(event.eventId)} 
                  className="events-card-btn events-btn-delete"
                >
                  <FiTrash2 size={14} />
                </button>
              </div>
            </div>
          </div>
        ))}
        {filteredEvents.length === 0 && (
          <div className="events-empty">
            <p>No events found</p>
          </div>
        )}
      </div>

      <CreateEvent
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSuccess={handleSuccess}
        churchId={churchId}
      />

      {selectedEvent && (
        <UpdateEvent
          isOpen={updateModalOpen}
          onClose={() => {
            setUpdateModalOpen(false);
            setSelectedEvent(null);
          }}
          onSuccess={handleSuccess}
          event={selectedEvent}
        />
      )}
    </div>
  );
}