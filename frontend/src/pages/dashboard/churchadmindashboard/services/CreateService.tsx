import { useState } from "react";
import { useSelector } from "react-redux";
import { FiX } from "react-icons/fi";
import { createService } from "../../../../Features/services/servicesAPI";
import "./CreateService.css";

interface CreateServiceProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  churchId?: number;
}

export default function CreateService({ isOpen, onClose, onSuccess, churchId }: CreateServiceProps) {
  const token = useSelector((state: any) => state.user.token);
  const userChurchId = useSelector((state: any) => state.user.user?.churchId);
  
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const finalChurchId = churchId || userChurchId;
      
      if (!finalChurchId) {
        setError("Church ID is required");
        setLoading(false);
        return;
      }

      // Create date objects
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

      // Build payload EXACTLY like Postman
      const payload = {
        churchId: Number(finalChurchId),
        name: formData.name.trim(),
        description: formData.description.trim() || undefined,
        dayOfWeek: Number(formData.dayOfWeek),
        startTime: startDate.toISOString(),
        endTime: endDate ? endDate.toISOString() : undefined,
        serviceType: formData.serviceType,
        attendanceType: formData.attendanceType,
        isActive: Boolean(formData.isActive),
      };

      console.log("Sending payload:", JSON.stringify(payload, null, 2));

      const response = await createService(payload, token);
      console.log("Service created:", response);
      
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
      onSuccess();
    } catch (err: any) {
      console.error("Full error response:", err.response);
      setError(err.response?.data?.message || "Failed to create service");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  return (
    <div className="create-service-overlay" onClick={onClose}>
      <div className="create-service-modal" onClick={(e) => e.stopPropagation()}>
        <div className="create-service-header">
          <h3>Add Service</h3>
          <button onClick={onClose} className="create-service-close">
            <FiX size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="create-service-form">
          <div className="create-service-group">
            <label>Service Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Sunday Worship"
              required
            />
          </div>
          <div className="create-service-group">
            <label>Description</label>
            <input
              type="text"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Main Sunday service"
            />
          </div>
          <div className="create-service-row">
            <div className="create-service-group">
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
            <div className="create-service-group">
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
          <div className="create-service-row">
            <div className="create-service-group">
              <label>Start Time</label>
              <input
                type="time"
                value={formData.startTime}
                onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                required
              />
            </div>
            <div className="create-service-group">
              <label>End Time (Optional)</label>
              <input
                type="time"
                value={formData.endTime}
                onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
              />
            </div>
          </div>
          <div className="create-service-group">
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
          <div className="create-service-checkbox">
            <label className="create-service-checkbox-label">
              <input
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
              />
              Active
            </label>
          </div>
          {error && <div className="create-service-error">{error}</div>}
          <div className="create-service-actions">
            <button type="button" onClick={onClose} className="create-service-cancel">
              Cancel
            </button>
            <button type="submit" className="create-service-save" disabled={loading}>
              {loading ? "Creating..." : "Create Service"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}