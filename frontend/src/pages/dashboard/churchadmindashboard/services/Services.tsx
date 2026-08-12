import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { fetchServices, createService, updateService, deleteService, type Service } from "../../../../Features/services/servicesAPI";
import { FiPlus, FiEdit2, FiTrash2, FiSearch, FiX } from "react-icons/fi";
import "./Services.css";

export default function Services() {
  const token = useSelector((state: any) => state.user.token);
  const churchId = useSelector((state: any) => state.user.user?.churchId);

  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredServices, setFilteredServices] = useState<Service[]>([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    dayOfWeek: 0,
    startTime: "",
    endTime: "",
    serviceType: "regular",
    attendanceType: "in_person",
    isActive: true,
  });

  useEffect(() => {
    loadServices();
  }, []);

  useEffect(() => {
    filterServices();
  }, [services, searchTerm]);

  const loadServices = async () => {
    try {
      setLoading(true);
      const data = await fetchServices(token);
      const churchServices = data.filter((s) => s.churchId === churchId);
      setServices(churchServices);
    } catch (error) {
      console.error("Failed to load services:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterServices = () => {
    let filtered = [...services];
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (s) =>
          s.name.toLowerCase().includes(term) ||
          (s.description || "").toLowerCase().includes(term)
      );
    }
    setFilteredServices(filtered);
  };

  const handleCreate = () => {
    setEditingService(null);
    setFormData({
      name: "",
      description: "",
      dayOfWeek: 0,
      startTime: "",
      endTime: "",
      serviceType: "regular",
      attendanceType: "in_person",
      isActive: true,
    });
    setShowModal(true);
  };

  const handleEdit = (service: Service) => {
    setEditingService(service);
    const date = new Date(service.startTime);
    setFormData({
      name: service.name,
      description: service.description || "",
      dayOfWeek: service.dayOfWeek,
      startTime: date.toTimeString().slice(0, 5),
      endTime: service.endTime ? new Date(service.endTime).toTimeString().slice(0, 5) : "",
      serviceType: service.serviceType || "regular",
      attendanceType: service.attendanceType || "in_person",
      isActive: service.isActive,
    });
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const dateObj = new Date();
      const [startHours, startMinutes] = formData.startTime.split(":").map(Number);
      const start = new Date(dateObj);
      start.setHours(startHours, startMinutes, 0, 0);

      let end = null;
      if (formData.endTime) {
        const [endHours, endMinutes] = formData.endTime.split(":").map(Number);
        end = new Date(dateObj);
        end.setHours(endHours, endMinutes, 0, 0);
      }

      const payload = {
        churchId: churchId!,
        name: formData.name,
        description: formData.description || undefined,
        dayOfWeek: formData.dayOfWeek,
        startTime: start.toISOString(),
        endTime: end ? end.toISOString() : undefined,
        serviceType: formData.serviceType,
        attendanceType: formData.attendanceType,
        isActive: formData.isActive,
      };

      if (editingService) {
        await updateService(editingService.serviceId, payload, token);
      } else {
        await createService(payload, token);
      }
      setShowModal(false);
      await loadServices();
    } catch (error: any) {
      console.error("Failed to save service:", error);
      alert(error.response?.data?.message || "Failed to save service.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTargetId) return;
    try {
      await deleteService(deleteTargetId, token);
      setShowDeleteModal(false);
      setDeleteTargetId(null);
      await loadServices();
    } catch (error) {
      console.error("Failed to delete service:", error);
      alert("Failed to delete service.");
    }
  };

  const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  if (loading) {
    return (
      <div className="admin-services-loading">
        <div className="admin-services-loading-spinner"></div>
        <p>Loading services...</p>
      </div>
    );
  }

  return (
    <div className="admin-services-page">
      <div className="admin-services-header">
        <div>
          <h2 className="admin-services-title">Services</h2>
          <p className="admin-services-subtitle">Manage church services and schedules</p>
        </div>
        <button className="admin-services-add-btn" onClick={handleCreate}>
          <FiPlus size={18} />
          Create Service
        </button>
      </div>

      <div className="admin-services-search">
        <div className="admin-services-search-wrapper">
          <FiSearch className="admin-services-search-icon" />
          <input
            type="text"
            placeholder="Search services..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="admin-services-search-input"
          />
          {searchTerm && (
            <button onClick={() => setSearchTerm("")} className="admin-services-search-clear">
              <FiX size={16} />
            </button>
          )}
        </div>
      </div>

      <div className="admin-services-grid">
        {filteredServices.length > 0 ? (
          filteredServices.map((service) => (
            <div key={service.serviceId} className="admin-services-card">
              <div className="admin-services-card-header">
                <h3 className="admin-services-card-title">{service.name}</h3>
                <span className={`admin-services-card-status ${service.isActive ? "status-active" : "status-inactive"}`}>
                  {service.isActive ? "Active" : "Inactive"}
                </span>
              </div>
              {service.description && (
                <p className="admin-services-card-description">{service.description}</p>
              )}
              <div className="admin-services-card-meta">
                <span className="admin-services-meta-item">📅 {dayNames[service.dayOfWeek]}</span>
                <span className="admin-services-meta-item">🕐 {new Date(service.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                {service.endTime && (
                  <span className="admin-services-meta-item"> - {new Date(service.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                )}
                <span className="admin-services-meta-item">📋 {service.serviceType}</span>
                <span className="admin-services-meta-item">📍 {service.attendanceType}</span>
              </div>
              <div className="admin-services-card-actions">
                <button className="admin-services-btn-edit" onClick={() => handleEdit(service)}>
                  <FiEdit2 size={14} /> Edit
                </button>
                <button
                  className="admin-services-btn-delete"
                  onClick={() => {
                    setDeleteTargetId(service.serviceId);
                    setShowDeleteModal(true);
                  }}
                >
                  <FiTrash2 size={14} /> Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="admin-services-empty">
            <p>No services found</p>
          </div>
        )}
      </div>

      {showModal && (
        <div className="admin-services-modal-overlay" onClick={() => setShowModal(false)}>
          <div className="admin-services-modal" onClick={(e) => e.stopPropagation()}>
            <div className="admin-services-modal-header">
              <h3>{editingService ? "Edit Service" : "Create Service"}</h3>
              <button className="admin-services-modal-close" onClick={() => setShowModal(false)}>
                Close
              </button>
            </div>
            <form onSubmit={handleSubmit} className="admin-services-modal-form">
              <div className="admin-services-form-group">
                <label>Service Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Sunday Worship"
                  required
                />
              </div>
              <div className="admin-services-form-group">
                <label>Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={2}
                  placeholder="Service description"
                />
              </div>
              <div className="admin-services-form-row">
                <div className="admin-services-form-group">
                  <label>Day of Week *</label>
                  <select
                    value={formData.dayOfWeek}
                    onChange={(e) => setFormData({ ...formData, dayOfWeek: parseInt(e.target.value) })}
                  >
                    {dayNames.map((day, index) => (
                      <option key={index} value={index}>{day}</option>
                    ))}
                  </select>
                </div>
                <div className="admin-services-form-group">
                  <label>Service Type</label>
                  <select
                    value={formData.serviceType}
                    onChange={(e) => setFormData({ ...formData, serviceType: e.target.value })}
                  >
                    <option value="regular">Regular</option>
                    <option value="worship">Worship</option>
                    <option value="bible_study">Bible Study</option>
                    <option value="prayer">Prayer</option>
                    <option value="youth">Youth</option>
                    <option value="children">Children</option>
                  </select>
                </div>
              </div>
              <div className="admin-services-form-row">
                <div className="admin-services-form-group">
                  <label>Start Time *</label>
                  <input
                    type="time"
                    value={formData.startTime}
                    onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                    required
                  />
                </div>
                <div className="admin-services-form-group">
                  <label>End Time</label>
                  <input
                    type="time"
                    value={formData.endTime}
                    onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                  />
                </div>
              </div>
              <div className="admin-services-form-row">
                <div className="admin-services-form-group">
                  <label>Attendance Type</label>
                  <select
                    value={formData.attendanceType}
                    onChange={(e) => setFormData({ ...formData, attendanceType: e.target.value })}
                  >
                    <option value="in_person">In Person</option>
                    <option value="online">Online</option>
                    <option value="both">Both</option>
                  </select>
                </div>
                <div className="admin-services-form-group">
                  <label>Status</label>
                  <select
                    value={formData.isActive ? "active" : "inactive"}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.value === "active" })}
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>
              <div className="admin-services-modal-actions">
                <button type="button" className="admin-services-modal-cancel" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="admin-services-modal-submit" disabled={submitting}>
                  {submitting ? "Saving..." : editingService ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showDeleteModal && (
        <div className="admin-services-modal-overlay" onClick={() => setShowDeleteModal(false)}>
          <div className="admin-services-modal admin-services-modal-small" onClick={(e) => e.stopPropagation()}>
            <div className="admin-services-modal-header">
              <h3>Delete Service</h3>
              <button className="admin-services-modal-close" onClick={() => setShowDeleteModal(false)}>
                Close
              </button>
            </div>
            <div className="admin-services-modal-body">
              <p>Are you sure you want to delete this service?</p>
              <p className="admin-services-modal-warning">This action cannot be undone.</p>
            </div>
            <div className="admin-services-modal-actions">
              <button className="admin-services-modal-cancel" onClick={() => setShowDeleteModal(false)}>
                Cancel
              </button>
              <button className="admin-services-modal-danger" onClick={handleDelete}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}