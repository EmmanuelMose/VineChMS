import { useState } from "react";
import { useSelector } from "react-redux";
import { FiX } from "react-icons/fi";
import { createGroup } from "../../../../Features/groups/groupsAPI";
import { type Member } from "../../../../Features/members/membersAPI";
import "./CreateGroup.css";

interface CreateGroupProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  churchId?: number;
  members: Member[];
}

export default function CreateGroup({ isOpen, onClose, onSuccess, churchId, members }: CreateGroupProps) {
  const token = useSelector((state: any) => state.user.token);
  
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    type: "",
    leaderId: "",
    meetingDay: "",
    meetingTime: "",
    location: "",
    isActive: true,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      let meetingTime = null;
      if (formData.meetingTime) {
        const [hours, minutes] = formData.meetingTime.split(":").map(Number);
        const date = new Date();
        date.setHours(hours, minutes, 0, 0);
        meetingTime = date.toISOString();
      }

      await createGroup({
        churchId: Number(churchId),
        name: formData.name,
        description: formData.description || undefined,
        type: formData.type || undefined,
        leaderId: formData.leaderId ? parseInt(formData.leaderId) : undefined,
        meetingDay: formData.meetingDay ? parseInt(formData.meetingDay) : undefined,
        meetingTime: meetingTime || undefined,
        location: formData.location || undefined,
        isActive: formData.isActive,
      }, token);
      
      setFormData({
        name: "",
        description: "",
        type: "",
        leaderId: "",
        meetingDay: "",
        meetingTime: "",
        location: "",
        isActive: true,
      });
      onSuccess();
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to create group");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const availableLeaders = members.filter(m => m.isActive && m.churchId === churchId && m.isLeader);
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  return (
    <div className="create-group-overlay" onClick={onClose}>
      <div className="create-group-modal" onClick={(e) => e.stopPropagation()}>
        <div className="create-group-header">
          <h3>Create Group</h3>
          <button onClick={onClose} className="create-group-close">
            <FiX size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="create-group-form">
          <div className="create-group-group">
            <label>Group Name *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter group name"
              required
            />
          </div>
          <div className="create-group-group">
            <label>Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Enter group description"
              rows={2}
            />
          </div>
          <div className="create-group-row">
            <div className="create-group-group">
              <label>Type</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              >
                <option value="">Select type</option>
                <option value="fellowship">Fellowship</option>
                <option value="youth">Youth</option>
                <option value="bible_study">Bible Study</option>
                <option value="prayer">Prayer</option>
                <option value="worship">Worship</option>
                <option value="service">Service</option>
                <option value="outreach">Outreach</option>
              </select>
            </div>
            <div className="create-group-group">
              <label>Leader</label>
              <select
                value={formData.leaderId}
                onChange={(e) => setFormData({ ...formData, leaderId: e.target.value })}
              >
                <option value="">Select leader</option>
                {availableLeaders.map((member) => (
                  <option key={member.memberId} value={member.memberId}>
                    {member.fullName}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="create-group-row">
            <div className="create-group-group">
              <label>Meeting Day</label>
              <select
                value={formData.meetingDay}
                onChange={(e) => setFormData({ ...formData, meetingDay: e.target.value })}
              >
                <option value="">Select day</option>
                {days.map((day, index) => (
                  <option key={index} value={index}>{day}</option>
                ))}
              </select>
            </div>
            <div className="create-group-group">
              <label>Meeting Time</label>
              <input
                type="time"
                value={formData.meetingTime}
                onChange={(e) => setFormData({ ...formData, meetingTime: e.target.value })}
              />
            </div>
          </div>
          <div className="create-group-group">
            <label>Location</label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              placeholder="Meeting location"
            />
          </div>
          <div className="create-group-checkbox">
            <label className="create-group-checkbox-label">
              <input
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
              />
              Active
            </label>
          </div>
          {error && <div className="create-group-error">{error}</div>}
          <div className="create-group-actions">
            <button type="button" onClick={onClose} className="create-group-cancel">
              Cancel
            </button>
            <button type="submit" className="create-group-save" disabled={loading}>
              {loading ? "Creating..." : "Create Group"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}