import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { FiX } from "react-icons/fi";
import { updateAttendance, type Attendance as AttendanceType } from "../../../../Features/attendance/attendanceAPI";
import { type Member } from "../../../../Features/members/membersAPI";
import { type Service } from "../../../../Features/services/servicesAPI";
import "./UpdateAttendance.css";

interface UpdateAttendanceProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  attendance: AttendanceType;
  members: Member[];
  services: Service[];
}

export default function UpdateAttendance({ isOpen, onClose, onSuccess, attendance, members, services }: UpdateAttendanceProps) {
  const token = useSelector((state: any) => state.user.token);
  const churchId = useSelector((state: any) => state.user.user?.churchId);
  
  const [formData, setFormData] = useState({
    memberId: "",
    serviceId: "",
    date: "",
    attended: true,
    checkInTime: "",
    checkOutTime: "",
    notes: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (attendance) {
      const date = new Date(attendance.date);
      const checkIn = attendance.checkInTime ? new Date(attendance.checkInTime) : null;
      const checkOut = attendance.checkOutTime ? new Date(attendance.checkOutTime) : null;

      setFormData({
        memberId: attendance.memberId.toString(),
        serviceId: attendance.serviceId.toString(),
        date: date.toISOString().split("T")[0],
        attended: attendance.attended,
        checkInTime: checkIn ? checkIn.toTimeString().slice(0, 5) : "",
        checkOutTime: checkOut ? checkOut.toTimeString().slice(0, 5) : "",
        notes: attendance.notes || "",
      });
    }
  }, [attendance]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const date = new Date(formData.date);
      
      let checkInTime = null;
      if (formData.checkInTime) {
        const [hours, minutes] = formData.checkInTime.split(":").map(Number);
        const checkIn = new Date(date);
        checkIn.setHours(hours, minutes, 0, 0);
        checkInTime = checkIn.toISOString();
      }

      let checkOutTime = null;
      if (formData.checkOutTime) {
        const [hours, minutes] = formData.checkOutTime.split(":").map(Number);
        const checkOut = new Date(date);
        checkOut.setHours(hours, minutes, 0, 0);
        checkOutTime = checkOut.toISOString();
      }

      await updateAttendance(attendance.attendanceId, {
        memberId: parseInt(formData.memberId),
        serviceId: parseInt(formData.serviceId),
        date: date.toISOString(),
        attended: formData.attended,
        checkInTime: checkInTime || undefined,
        checkOutTime: checkOutTime || undefined,
        notes: formData.notes || undefined,
      }, token);
      onSuccess();
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to update attendance record");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const availableMembers = members.filter(m => m.isActive && m.churchId === churchId);
  const availableServices = services.filter(s => s.churchId === churchId && s.isActive);

  return (
    <div className="update-attendance-overlay" onClick={onClose}>
      <div className="update-attendance-modal" onClick={(e) => e.stopPropagation()}>
        <div className="update-attendance-header">
          <h3>Edit Attendance</h3>
          <button onClick={onClose} className="update-attendance-close">
            <FiX size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="update-attendance-form">
          <div className="update-attendance-group">
            <label>Member *</label>
            <select
              value={formData.memberId}
              onChange={(e) => setFormData({ ...formData, memberId: e.target.value })}
              required
            >
              <option value="">Select a member</option>
              {availableMembers.map((member) => (
                <option key={member.memberId} value={member.memberId}>
                  {member.fullName} ({member.email})
                </option>
              ))}
            </select>
          </div>

          <div className="update-attendance-group">
            <label>Service *</label>
            <select
              value={formData.serviceId}
              onChange={(e) => setFormData({ ...formData, serviceId: e.target.value })}
              required
            >
              <option value="">Select a service</option>
              {availableServices.map((service) => (
                <option key={service.serviceId} value={service.serviceId}>
                  {service.name} ({new Date(service.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })})
                </option>
              ))}
            </select>
          </div>

          <div className="update-attendance-group">
            <label>Date *</label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              required
            />
          </div>

          <div className="update-attendance-checkbox">
            <label className="update-attendance-checkbox-label">
              <input
                type="checkbox"
                checked={formData.attended}
                onChange={(e) => setFormData({ ...formData, attended: e.target.checked })}
              />
              Attended
            </label>
          </div>

          <div className="update-attendance-row">
            <div className="update-attendance-group">
              <label>Check In Time</label>
              <input
                type="time"
                value={formData.checkInTime}
                onChange={(e) => setFormData({ ...formData, checkInTime: e.target.value })}
              />
            </div>
            <div className="update-attendance-group">
              <label>Check Out Time</label>
              <input
                type="time"
                value={formData.checkOutTime}
                onChange={(e) => setFormData({ ...formData, checkOutTime: e.target.value })}
              />
            </div>
          </div>

          <div className="update-attendance-group">
            <label>Notes</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={2}
              placeholder="Additional notes about this attendance"
            />
          </div>

          {error && <div className="update-attendance-error">{error}</div>}

          <div className="update-attendance-actions">
            <button type="button" onClick={onClose} className="update-attendance-cancel">
              Cancel
            </button>
            <button type="submit" className="update-attendance-save" disabled={loading}>
              {loading ? "Updating..." : "Update Attendance"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}