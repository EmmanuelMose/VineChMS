import { useState, useEffect } from "react";
import { FiArrowLeft, FiCheckCircle, FiXCircle } from "react-icons/fi";
import { fetchEventRegistrations, updateEventRegistration, deleteEventRegistration, type EventRegistration } from "../../../../Features/events/eventsAPI";
import "./EventRegistration.css";

interface EventRegistrationsProps {
  eventId: number;
  onBack: () => void;
  token: string;
}

export default function EventRegistrations({ eventId, onBack, token }: EventRegistrationsProps) {
  const [registrations, setRegistrations] = useState<EventRegistration[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterAttended, setFilterAttended] = useState("all");

  useEffect(() => {
    loadRegistrations();
  }, [eventId]);

  const loadRegistrations = async () => {
    try {
      setLoading(true);
      const data = await fetchEventRegistrations(eventId, token);
      setRegistrations(data);
    } catch (error) {
      console.error("Failed to load registrations:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleAttendance = async (id: number, currentStatus: boolean) => {
    try {
      await updateEventRegistration(id, { attended: !currentStatus }, token);
      await loadRegistrations();
    } catch (error) {
      console.error("Failed to update attendance:", error);
    }
  };

  const handleDeleteRegistration = async (id: number) => {
    if (window.confirm("Are you sure you want to remove this registration?")) {
      try {
        await deleteEventRegistration(id, token);
        await loadRegistrations();
      } catch (error) {
        console.error("Failed to delete registration:", error);
      }
    }
  };

  const filteredRegistrations = registrations.filter(reg => {
    const matchesSearch = (reg.fullName || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (reg.email || "").toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterAttended === "all" ||
                          (filterAttended === "attended" && reg.attended) ||
                          (filterAttended === "not-attended" && !reg.attended);
    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return (
      <div className="registrations-loading">
        <div className="registrations-loading-spinner"></div>
        <p>Loading registrations...</p>
      </div>
    );
  }

  return (
    <div className="registrations-page">
      <div className="registrations-header">
        <button onClick={onBack} className="registrations-back-btn">
          <FiArrowLeft size={18} />
          Back to Events
        </button>
        <h2 className="registrations-title">Event Registrations</h2>
        <p className="registrations-count">{registrations.length} registered</p>
      </div>

      <div className="registrations-toolbar">
        <div className="registrations-search">
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="registrations-search-input"
          />
        </div>
        <div className="registrations-filters">
          <select 
            value={filterAttended} 
            onChange={(e) => setFilterAttended(e.target.value)}
            className="registrations-filter-select"
          >
            <option value="all">All</option>
            <option value="attended">Attended</option>
            <option value="not-attended">Not Attended</option>
          </select>
        </div>
      </div>

      <div className="registrations-table-wrapper">
        <table className="registrations-table">
          <thead>
            <tr>
              <th>Member</th>
              <th>Email</th>
              <th>Registered On</th>
              <th>Attended</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredRegistrations.map((reg) => (
              <tr key={reg.registrationId}>
                <td>
                  <div className="registrations-cell-member">
                    <div className="registrations-avatar">
                      {(reg.fullName || "U").charAt(0).toUpperCase()}
                    </div>
                    <span>{reg.fullName || "Unknown"}</span>
                  </div>
                </td>
                <td>{reg.email || "No email"}</td>
                <td>{new Date(reg.createdAt).toLocaleDateString()}</td>
                <td>
                  <span className={`registrations-status-badge ${reg.attended ? "status-attended" : "status-not-attended"}`}>
                    {reg.attended ? "Attended" : "Not Attended"}
                  </span>
                </td>
                <td>
                  <div className="registrations-actions-cell">
                    <button 
                      onClick={() => handleToggleAttendance(reg.registrationId, reg.attended)} 
                      className={`registrations-action-btn ${reg.attended ? "registrations-action-unmark" : "registrations-action-mark"}`}
                      title={reg.attended ? "Mark as not attended" : "Mark as attended"}
                    >
                      {reg.attended ? <FiXCircle size={16} /> : <FiCheckCircle size={16} />}
                    </button>
                    <button 
                      onClick={() => handleDeleteRegistration(reg.registrationId)} 
                      className="registrations-action-btn registrations-action-delete"
                      title="Remove registration"
                    >
                      <FiXCircle size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filteredRegistrations.length === 0 && (
              <tr>
                <td colSpan={5} className="registrations-empty">
                  No registrations found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}