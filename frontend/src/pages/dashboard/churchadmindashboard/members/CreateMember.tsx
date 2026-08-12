import { useState } from "react";
import { useSelector } from "react-redux";
import { FiX } from "react-icons/fi";
import { inviteMember } from "../../../../Features/auth/authAPI";
import "./CreateMember.css";

interface CreateMemberProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function CreateMember({ isOpen, onClose, onSuccess }: CreateMemberProps) {
  const token = useSelector((state: any) => state.user.token);
  const churchId = useSelector((state: any) => state.user.user?.churchId);
  
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    role: "church_member",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await inviteMember({
        fullName: formData.fullName,
        email: formData.email,
        role: formData.role,
        churchId: churchId,
      }, token);
      
      setFormData({ fullName: "", email: "", role: "church_member" });
      onSuccess();
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to send invitation");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="create-member-overlay" onClick={onClose}>
      <div className="create-member-modal" onClick={(e) => e.stopPropagation()}>
        <div className="create-member-header">
          <h3>Add Member</h3>
          <button onClick={onClose} className="create-member-close">
            <FiX size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="create-member-form">
          <div className="create-member-group">
            <label>Full Name</label>
            <input
              type="text"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              placeholder="John Doe"
              required
            />
          </div>
          <div className="create-member-group">
            <label>Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="john@church.com"
              required
            />
          </div>
          <div className="create-member-group">
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
            </select>
          </div>
          {error && <div className="create-member-error">{error}</div>}
          <div className="create-member-actions">
            <button type="button" onClick={onClose} className="create-member-cancel">
              Cancel
            </button>
            <button type="submit" className="create-member-save" disabled={loading}>
              {loading ? "Sending Invitation..." : "Send Invitation"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}