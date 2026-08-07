import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { FiX } from "react-icons/fi";
import { updateGroup, type Group } from "../../../../Features/groups/groupsAPI";
import { type Member } from "../../../../Features/members/membersAPI";
import "./UpdateGroup.css";

interface UpdateGroupProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  group: Group;
  members: Member[];
}

export default function UpdateGroup({ isOpen, onClose, onSuccess, group, members }: UpdateGroupProps) {
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

  useEffect(() => {
    if (group) {
      let meetingTime = "";
      if (group.meetingTime) {
        const date = new Date(group.meetingTime);
        meetingTime = date.toTimeString().slice(0, 5);
      }

      setFormData({
        name: group.name,
        description: group.description || "",
        type: group.type || "",
        leaderId: group.leaderId?.toString() || "",
        meetingDay: group.meetingDay?.toString() || "",
        meetingTime: meetingTime,
        location: group.location || "",
        isActive: group.isActive,
      });
    }
  }, [group]);

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

      await updateGroup(group.groupId, {
        name: formData.name,
        description: formData.description || undefined,
        type: formData.type || undefined,
        leaderId: formData.leaderId ? parseInt(formData.leaderId) : undefined,
        meetingDay: formData.meetingDay ? parseInt(formData.meetingDay) : undefined,
        meetingTime: meetingTime || undefined,
        location: formData.location || undefined,
        isActive: formData.isActive,
      }, token);
      onSuccess();
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to update group");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const availableLeaders = members.filter(m => m.isActive && m.churchId === group.churchId && m.isLeader);
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  return (
    <div className="update-group-overlay" onClick={onClose}>
      <div className="update-group-modal" onClick={(e) => e.stopPropagation()}>
        <div className="update-group-header">
          <h3>Edit Group</h3>
          <button onClick={onClose} className="update-group-close">
            <FiX size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="update-group-form">
          <div className="update-group-group">
            <label>Group Name *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>
          <div className="update-group-group">
            <label>Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={2}
            />
          </div>
          <div className="update-group-row">
            <div className="update-group-group">
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
            <div className="update-group-group">
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
          <div className="update-group-row">
            <div className="update-group-group">
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
            <div className="update-group-group">
              <label>Meeting Time</label>
              <input
                type="time"
                value={formData.meetingTime}
                onChange={(e) => setFormData({ ...formData, meetingTime: e.target.value })}
              />
            </div>
          </div>
          <div className="update-group-group">
            <label>Location</label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            />
          </div>
          <div className="update-group-checkbox">
            <label className="update-group-checkbox-label">
              <input
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
              />
              Active
            </label>
          </div>
          {error && <div className="update-group-error">{error}</div>}
          <div className="update-group-actions">
            <button type="button" onClick={onClose} className="update-group-cancel">
              Cancel
            </button>
            <button type="submit" className="update-group-save" disabled={loading}>
              {loading ? "Updating..." : "Update Group"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}