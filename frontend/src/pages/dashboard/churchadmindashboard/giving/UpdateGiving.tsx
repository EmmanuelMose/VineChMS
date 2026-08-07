import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { FiX } from "react-icons/fi";
import { updateGiving, type Giving } from "../../../../Features/giving/givingAPI";
import { type Member } from "../../../../Features/members/membersAPI";
import "./UpdateGiving.css";

interface UpdateGivingProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  giving: Giving;
  members: Member[];
}

export default function UpdateGiving({ isOpen, onClose, onSuccess, giving, members }: UpdateGivingProps) {
  const token = useSelector((state: any) => state.user.token);
  
  const [formData, setFormData] = useState({
    memberId: "",
    type: "offering",
    amount: "",
    date: "",
    paymentMethod: "",
    status: "pending",
    notes: "",
    isAnonymous: false,
    receiptNumber: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (giving) {
      setFormData({
        memberId: giving.memberId.toString(),
        type: giving.type,
        amount: giving.amount,
        date: giving.date.split("T")[0],
        paymentMethod: giving.paymentMethod || "",
        status: giving.status,
        notes: giving.notes || "",
        isAnonymous: giving.isAnonymous,
        receiptNumber: giving.receiptNumber || "",
      });
    }
  }, [giving]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await updateGiving(giving.givingId, {
        memberId: parseInt(formData.memberId),
        type: formData.type,
        amount: formData.amount,
        date: new Date(formData.date).toISOString(),
        paymentMethod: formData.paymentMethod || undefined,
        status: formData.status,
        notes: formData.notes || undefined,
        isAnonymous: formData.isAnonymous,
        receiptNumber: formData.receiptNumber || undefined,
      }, token);
      onSuccess();
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to update giving");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="update-giving-overlay" onClick={onClose}>
      <div className="update-giving-modal" onClick={(e) => e.stopPropagation()}>
        <div className="update-giving-header">
          <h3>Edit Giving Record</h3>
          <button onClick={onClose} className="update-giving-close">
            <FiX size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="update-giving-form">
          <div className="update-giving-group">
            <label>Member *</label>
            <select
              value={formData.memberId}
              onChange={(e) => setFormData({ ...formData, memberId: e.target.value })}
              required
            >
              <option value="">Select a member</option>
              {members.filter(m => m.isActive && m.churchId === giving.churchId).map((member) => (
                <option key={member.memberId} value={member.memberId}>
                  {member.fullName} ({member.email})
                </option>
              ))}
            </select>
          </div>

          <div className="update-giving-row">
            <div className="update-giving-group">
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
            <div className="update-giving-group">
              <label>Amount *</label>
              <input
                type="number"
                step="0.01"
                min="0.01"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="update-giving-row">
            <div className="update-giving-group">
              <label>Date *</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                required
              />
            </div>
            <div className="update-giving-group">
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

          <div className="update-giving-row">
            <div className="update-giving-group">
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
            <div className="update-giving-group">
              <label>Receipt Number</label>
              <input
                type="text"
                value={formData.receiptNumber}
                onChange={(e) => setFormData({ ...formData, receiptNumber: e.target.value })}
              />
            </div>
          </div>

          <div className="update-giving-group">
            <label>Notes</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={2}
              placeholder="Additional notes"
            />
          </div>

          <div className="update-giving-checkbox">
            <label className="update-giving-checkbox-label">
              <input
                type="checkbox"
                checked={formData.isAnonymous}
                onChange={(e) => setFormData({ ...formData, isAnonymous: e.target.checked })}
              />
              Anonymous Donation
            </label>
          </div>

          {error && <div className="update-giving-error">{error}</div>}

          <div className="update-giving-actions">
            <button type="button" onClick={onClose} className="update-giving-cancel">
              Cancel
            </button>
            <button type="submit" className="update-giving-save" disabled={loading}>
              {loading ? "Updating..." : "Update Giving"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}