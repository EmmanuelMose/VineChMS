import { useState } from "react";
import { useSelector } from "react-redux";
import { FiX } from "react-icons/fi";
import { createLeader } from "../../../../Features/leaders/leadersAPI";
import { type Position } from "../../../../Features/positions/positionsAPI";
import { type Member } from "../../../../Features/members/membersAPI";
import "./CreateLeader.css";

interface CreateLeaderProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  positions: Position[];
  members: Member[];
}

export default function CreateLeader({ isOpen, onClose, onSuccess, positions, members }: CreateLeaderProps) {
  const token = useSelector((state: any) => state.user.token);
  const churchId = useSelector((state: any) => state.user.user?.churchId);
  
  const [formData, setFormData] = useState({
    memberId: "",
    positionId: "",
    startDate: "",
    endDate: "",
    isActive: true,
    isApproved: false,
    notes: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await createLeader({
        memberId: parseInt(formData.memberId),
        positionId: parseInt(formData.positionId),
        startDate: formData.startDate || new Date().toISOString(),
        endDate: formData.endDate || undefined,
        isActive: formData.isActive,
        isApproved: formData.isApproved,
        notes: formData.notes || undefined,
      }, token);
      
      setFormData({
        memberId: "",
        positionId: "",
        startDate: "",
        endDate: "",
        isActive: true,
        isApproved: false,
        notes: "",
      });
      onSuccess();
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to create leader");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const availableMembers = members.filter(m => m.isActive && m.churchId === churchId);

  return (
    <div className="create-leader-overlay" onClick={onClose}>
      <div className="create-leader-modal" onClick={(e) => e.stopPropagation()}>
        <div className="create-leader-header">
          <h3>Add Leader</h3>
          <button onClick={onClose} className="create-leader-close">
            <FiX size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="create-leader-form">
          <div className="create-leader-group">
            <label>Member</label>
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
          <div className="create-leader-group">
            <label>Position</label>
            <select
              value={formData.positionId}
              onChange={(e) => setFormData({ ...formData, positionId: e.target.value })}
              required
            >
              <option value="">Select a position</option>
              {positions.filter(p => p.churchId === churchId || p.churchId === null).map((position) => (
                <option key={position.positionId} value={position.positionId}>
                  {position.name}
                </option>
              ))}
            </select>
          </div>
          <div className="create-leader-row">
            <div className="create-leader-group">
              <label>Start Date</label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                required
              />
            </div>
            <div className="create-leader-group">
              <label>End Date (Optional)</label>
              <input
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
              />
            </div>
          </div>
          <div className="create-leader-checkboxes">
            <label className="create-leader-checkbox">
              <input
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
              />
              Active
            </label>
            <label className="create-leader-checkbox">
              <input
                type="checkbox"
                checked={formData.isApproved}
                onChange={(e) => setFormData({ ...formData, isApproved: e.target.checked })}
              />
              Approved
            </label>
          </div>
          <div className="create-leader-group">
            <label>Notes</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={3}
              placeholder="Additional notes about this leader"
            />
          </div>
          {error && <div className="create-leader-error">{error}</div>}
          <div className="create-leader-actions">
            <button type="button" onClick={onClose} className="create-leader-cancel">
              Cancel
            </button>
            <button type="submit" className="create-leader-save" disabled={loading}>
              {loading ? "Creating..." : "Create Leader"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}