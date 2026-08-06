import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { FiX } from "react-icons/fi";
import { updateService, type Service } from "../../../../Features/services/servicesAPI";
import "./UpdateService.css";

interface UpdateServiceProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  service: Service;
}

export default function UpdateService({ isOpen, onClose, onSuccess, service }: UpdateServiceProps) {
  const token = useSelector((state: any) => state.user.token);
  
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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (service) {
      const startTime = new Date(service.startTime);
      const endTime = service.endTime ? new Date(service.endTime) : null;
      
      setFormData({
        name: service.name,
        description: service.description || "",
        dayOfWeek: service.dayOfWeek,
        startTime: startTime.toTimeString().slice(0, 5),
        endTime: endTime ? endTime.toTimeString().slice(0, 5) : "",
        serviceType: service.serviceType || "regular",
        attendanceType: service.attendanceType || "in_person",
        isActive: service.isActive,
      });
    }
  }, [service]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Create proper date objects for start and end times
      const today = new Date();
      const startDate = new Date(today);
      const [startHours, startMinutes] = formData.startTime.split(":").map(Number);
      startDate.setHours(startHours, startMinutes, 0, 0);

      let endDate = null;
      if (formData.endTime) {
        endDate = new Date(today);
        const [endHours, endMinutes] = formData.endTime.split(":").map(Number);
        endDate.setHours(endHours, endMinutes, 0, 0);
      }

      await updateService(service.serviceId, {
        name: formData.name,
        description: formData.description || undefined,
        dayOfWeek: formData.dayOfWeek,
        startTime: startDate.toISOString(),
        endTime: endDate ? endDate.toISOString() : undefined,
        serviceType: formData.serviceType,
        attendanceType: formData.attendanceType,
        isActive: formData.isActive,
      }, token);
      onSuccess();
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to update service");
      console.error("Update service error:", err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  return (
    <div className="update-service-overlay" onClick={onClose}>
      <div className="update-service-modal" onClick={(e) => e.stopPropagation()}>
        <div className="update-service-header">
          <h3>Edit Service</h3>
          <button onClick={onClose} className="update-service-close">
            <FiX size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="update-service-form">
          <div className="update-service-group">
            <label>Service Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>
          <div className="update-service-group">
            <label>Description</label>
            <input
              type="text"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>
          <div className="update-service-row">
            <div className="update-service-group">
              <label>Day of Week</label>
              <select
                value={formData.dayOfWeek}
                onChange={(e) => setFormData({ ...formData, dayOfWeek: parseInt(e.target.value) })}
              >
                {days.map((day, index) => (
                  <option key={index} value={index}>{day}</option>
                ))}
              </select>
            </div>
            <div className="update-service-group">
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
                <option value="fellowship">Fellowship</option>
              </select>
            </div>
          </div>
          <div className="update-service-row">
            <div className="update-service-group">
              <label>Start Time</label>
              <input
                type="time"
                value={formData.startTime}
                onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                required
              />
            </div>
            <div className="update-service-group">
              <label>End Time (Optional)</label>
              <input
                type="time"
                value={formData.endTime}
                onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
              />
            </div>
          </div>
          <div className="update-service-group">
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
          <div className="update-service-checkbox">
            <label className="update-service-checkbox-label">
              <input
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
              />
              Active
            </label>
          </div>
          {error && <div className="update-service-error">{error}</div>}
          <div className="update-service-actions">
            <button type="button" onClick={onClose} className="update-service-cancel">
              Cancel
            </button>
            <button type="submit" className="update-service-save" disabled={loading}>
              {loading ? "Updating..." : "Update Service"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}