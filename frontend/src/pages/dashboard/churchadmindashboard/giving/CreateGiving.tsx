import { useState } from "react";
import { useSelector } from "react-redux";
import { FiX } from "react-icons/fi";
import { createGiving } from "../../../../Features/giving/givingAPI";
import { type Member } from "../../../../Features/members/membersAPI";
import "./CreateGiving.css";

interface CreateGivingProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  churchId?: number;
  members: Member[];
}

export default function CreateGiving({ isOpen, onClose, onSuccess, churchId, members }: CreateGivingProps) {
  const token = useSelector((state: any) => state.user.token);
  
  const [formData, setFormData] = useState({
    memberId: "",
    type: "offering",
    amount: "",
    date: new Date().toISOString().split("T")[0],
    paymentMethod: "",
    status: "pending",
    notes: "",
    isAnonymous: false,
    receiptNumber: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await createGiving({
        memberId: parseInt(formData.memberId),
        churchId: Number(churchId),
        type: formData.type,
        amount: formData.amount,
        date: new Date(formData.date).toISOString(),
        paymentMethod: formData.paymentMethod || undefined,
        status: formData.status,
        notes: formData.notes || undefined,
        isAnonymous: formData.isAnonymous,
        receiptNumber: formData.receiptNumber || undefined,
      }, token);
      
      setFormData({
        memberId: "",
        type: "offering",
        amount: "",
        date: new Date().toISOString().split("T")[0],
        paymentMethod: "",
        status: "pending",
        notes: "",
        isAnonymous: false,
        receiptNumber: "",
      });
      onSuccess();
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to record giving");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const availableMembers = members.filter(m => m.isActive && m.churchId === churchId);

  return (
    <div className="create-giving-overlay" onClick={onClose}>
      <div className="create-giving-modal" onClick={(e) => e.stopPropagation()}>
        <div className="create-giving-header">
          <h3>Record Giving</h3>
          <button onClick={onClose} className="create-giving-close">
            <FiX size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="create-giving-form">
          <div className="create-giving-group">
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

          <div className="create-giving-row">
            <div className="create-giving-group">
              <label>Type *</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                required
              >
                <option value="tithe">Tithe</option>
                <option value="offering">Offering</option>
                <option value="donation">Donation</option>
                <option value="special">Special</option>
                <option value="pledge">Pledge</option>
              </select>
            </div>
            <div className="create-giving-group">
              <label>Amount *</label>
              <input
                type="number"
                step="0.01"
                min="0.01"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                placeholder="0.00"
                required
              />
            </div>
          </div>

          <div className="create-giving-row">
            <div className="create-giving-group">
              <label>Date *</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                required
              />
            </div>
            <div className="create-giving-group">
              <label>Payment Method</label>
              <select
                value={formData.paymentMethod}
                onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
              >
                <option value="">Select method</option>
                <option value="cash">Cash</option>
                <option value="bank">Bank Transfer</option>
                <option value="mpesa">M-Pesa</option>
                <option value="card">Card</option>
                <option value="check">Check</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          <div className="create-giving-row">
            <div className="create-giving-group">
              <label>Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              >
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
                <option value="failed">Failed</option>
                <option value="refunded">Refunded</option>
              </select>
            </div>
            <div className="create-giving-group">
              <label>Receipt Number</label>
              <input
                type="text"
                value={formData.receiptNumber}
                onChange={(e) => setFormData({ ...formData, receiptNumber: e.target.value })}
                placeholder="Optional"
              />
            </div>
          </div>

          <div className="create-giving-group">
            <label>Notes</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={2}
              placeholder="Additional notes"
            />
          </div>

          <div className="create-giving-checkbox">
            <label className="create-giving-checkbox-label">
              <input
                type="checkbox"
                checked={formData.isAnonymous}
                onChange={(e) => setFormData({ ...formData, isAnonymous: e.target.checked })}
              />
              Anonymous Donation
            </label>
          </div>

          {error && <div className="create-giving-error">{error}</div>}

          <div className="create-giving-actions">
            <button type="button" onClick={onClose} className="create-giving-cancel">
              Cancel
            </button>
            <button type="submit" className="create-giving-save" disabled={loading}>
              {loading ? "Recording..." : "Record Giving"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}