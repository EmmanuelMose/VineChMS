import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { FiX } from "react-icons/fi";
import { updateMember, type Member } from "../../../../Features/members/membersAPI";
import "./UpdateMember.css";

interface UpdateMemberProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  member: Member;
}

export default function UpdateMember({ isOpen, onClose, onSuccess, member }: UpdateMemberProps) {
  const token = useSelector((state: any) => state.user.token);
  
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    role: "church_member",
    isActive: true,
    isBaptized: false,
    isConfirmed: false,
    isLeader: false,
    notes: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (member) {
      setFormData({
        fullName: member.fullName,
        email: member.email,
        role: member.role,
        isActive: member.isActive,
        isBaptized: member.isBaptized || false,
        isConfirmed: member.isConfirmed || false,
        isLeader: member.isLeader || false,
        notes: member.notes || "",
      });
    }
  }, [member]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await updateMember(member.memberId, formData, token);
      onSuccess();
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to update member");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="update-member-overlay" onClick={onClose}>
      <div className="update-member-modal" onClick={(e) => e.stopPropagation()}>
        <div className="update-member-header">
          <h3>Edit Member</h3>
          <button onClick={onClose} className="update-member-close">
            <FiX size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="update-member-form">
          <div className="update-member-group">
            <label>Full Name</label>
            <input
              type="text"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              required
            />
          </div>
          <div className="update-member-group">
            <label>Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>
          <div className="update-member-row">
            <div className="update-member-group">
              <label>Role</label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              >
                <option value="church_member">Church Member</option>
                <option value="pastor">Pastor</option>
                <option value="elder">Elder</option>
                <option value="treasurer">Treasurer</option>
                <option value="secretary">Secretary</option>
                <option value="church_admin">Church Admin</option>
              </select>
            </div>
            <div className="update-member-group">
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
          <div className="update-member-checkboxes">
            <label className="update-member-checkbox">
              <input
                type="checkbox"
                checked={formData.isBaptized}
                onChange={(e) => setFormData({ ...formData, isBaptized: e.target.checked })}
              />
              Baptized
            </label>
            <label className="update-member-checkbox">
              <input
                type="checkbox"
                checked={formData.isConfirmed}
                onChange={(e) => setFormData({ ...formData, isConfirmed: e.target.checked })}
              />
              Confirmed
            </label>
            <label className="update-member-checkbox">
              <input
                type="checkbox"
                checked={formData.isLeader}
                onChange={(e) => setFormData({ ...formData, isLeader: e.target.checked })}
              />
              Leader
            </label>
          </div>
          <div className="update-member-group">
            <label>Notes</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={3}
              placeholder="Additional notes about this member"
            />
          </div>
          {error && <div className="update-member-error">{error}</div>}
          <div className="update-member-actions">
            <button type="button" onClick={onClose} className="update-member-cancel">
              Cancel
            </button>
            <button type="submit" className="update-member-save" disabled={loading}>
              {loading ? "Updating..." : "Update Member"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}