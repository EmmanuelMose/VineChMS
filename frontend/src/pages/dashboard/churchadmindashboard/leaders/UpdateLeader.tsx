import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { FiX } from "react-icons/fi";
import { updateLeader, type Leader } from "../../../../Features/leaders/leadersAPI";
import { type Position } from "../../../../Features/positions/positionsAPI";
import { type Member } from "../../../../Features/members/membersAPI";
import "./UpdateLeader.css";

interface UpdateLeaderProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  leader: Leader;
  positions: Position[];
  members: Member[];
}

export default function UpdateLeader({ isOpen, onClose, onSuccess, leader, positions }: UpdateLeaderProps) {
  const token = useSelector((state: any) => state.user.token);
  const churchId = useSelector((state: any) => state.user.user?.churchId);
  
  const [formData, setFormData] = useState({
    positionId: "",
    startDate: "",
    endDate: "",
    isActive: true,
    isApproved: false,
    notes: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (leader) {
      setFormData({
        positionId: leader.positionId.toString(),
        startDate: leader.startDate.split("T")[0],
        endDate: leader.endDate ? leader.endDate.split("T")[0] : "",
        isActive: leader.isActive,
        isApproved: leader.isApproved,
        notes: leader.notes || "",
      });
    }
  }, [leader]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await updateLeader(leader.leaderId, {
        positionId: parseInt(formData.positionId),
        startDate: formData.startDate,
        endDate: formData.endDate || undefined,
        isActive: formData.isActive,
        isApproved: formData.isApproved,
        notes: formData.notes || undefined,
      }, token);
      onSuccess();
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to update leader");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="update-leader-overlay" onClick={onClose}>
      <div className="update-leader-modal" onClick={(e) => e.stopPropagation()}>
        <div className="update-leader-header">
          <h3>Edit Leader</h3>
          <button onClick={onClose} className="update-leader-close">
            <FiX size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="update-leader-form">
          <div className="update-leader-group">
            <label>Member</label>
            <input
              type="text"
              value={leader.fullName || "Unknown"}
              disabled
              className="update-leader-disabled"
            />
          </div>
          <div className="update-leader-group">
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
          <div className="update-leader-row">
            <div className="update-leader-group">
              <label>Start Date</label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                required
              />
            </div>
            <div className="update-leader-group">
              <label>End Date (Optional)</label>
              <input
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
              />
            </div>
          </div>
          <div className="update-leader-checkboxes">
            <label className="update-leader-checkbox">
              <input
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
              />
              Active
            </label>
            <label className="update-leader-checkbox">
              <input
                type="checkbox"
                checked={formData.isApproved}
                onChange={(e) => setFormData({ ...formData, isApproved: e.target.checked })}
              />
              Approved
            </label>
          </div>
          <div className="update-leader-group">
            <label>Notes</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={3}
              placeholder="Additional notes about this leader"
            />
          </div>
          {error && <div className="update-leader-error">{error}</div>}
          <div className="update-leader-actions">
            <button type="button" onClick={onClose} className="update-leader-cancel">
              Cancel
            </button>
            <button type="submit" className="update-leader-save" disabled={loading}>
              {loading ? "Updating..." : "Update Leader"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}