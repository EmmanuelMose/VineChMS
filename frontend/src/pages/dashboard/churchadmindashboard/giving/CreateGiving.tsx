import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { FiX, FiSend, FiDollarSign } from "react-icons/fi";
import { createGiving } from "../../../../Features/giving/givingAPI";
import { type Member } from "../../../../Features/members/membersAPI";
import { type GivingCategory } from "../../../../Features/giving/givingAPI";
import "./CreateGiving.css";

interface CreateGivingProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  churchId?: number;
  members: Member[];
  categories: GivingCategory[];
  mode?: "mpesa" | "cash"; // default "mpesa"
}

export default function CreateGiving({
  isOpen,
  onClose,
  onSuccess,
  churchId,
  members,
  categories,
  mode = "mpesa",
}: CreateGivingProps) {
  const token = useSelector((state: any) => state.user.token);

  const [formData, setFormData] = useState({
    memberId: "",
    categoryId: "",
    amount: "",
    currency: "KES",
    paymentMethod: mode === "mpesa" ? "mpesa" : "cash",
    notes: "",
    isAnonymous: false,
    phoneNumber: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const selectedMember = members.find((m) => m.memberId === parseInt(formData.memberId));

  useEffect(() => {
    if (selectedMember && selectedMember.phone && mode === "mpesa") {
      setFormData((prev) => ({ ...prev, phoneNumber: selectedMember.phone || "" }));
    }
  }, [formData.memberId, selectedMember, mode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const payload: any = {
        memberId: parseInt(formData.memberId),
        churchId: Number(churchId),
        categoryId: formData.categoryId ? parseInt(formData.categoryId) : undefined,
        amount: formData.amount,
        currency: formData.currency,
        type: categories.find((c) => c.categoryId === parseInt(formData.categoryId))?.type || "offering",
        date: new Date().toISOString(),
        paymentMethod: mode === "mpesa" ? "mpesa" : "cash",
        notes: formData.notes || undefined,
        isAnonymous: formData.isAnonymous,
      };

      if (mode === "mpesa") {
        payload.phoneNumber = formData.phoneNumber;
        payload.status = "pending"; // will be auto-completed via callback
      } else {
        payload.status = "completed"; // admin records cash, mark as completed
      }

      await createGiving(payload, token);

      setFormData({
        memberId: "",
        categoryId: "",
        amount: "",
        currency: "KES",
        paymentMethod: mode === "mpesa" ? "mpesa" : "cash",
        notes: "",
        isAnonymous: false,
        phoneNumber: "",
      });
      onSuccess();
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to record giving");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const availableMembers = members.filter((m) => m.isActive && m.churchId === churchId);
  const availableCategories = categories.filter((c) => c.isActive);
  const isMpesaMode = mode === "mpesa";

  return (
    <div className="create-giving-overlay" onClick={onClose}>
      <div className="create-giving-modal" onClick={(e) => e.stopPropagation()}>
        <div className="create-giving-header">
          <h3>{isMpesaMode ? "Send M-Pesa STK Push" : "Record Cash Giving"}</h3>
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
              <label>Category *</label>
              <select
                value={formData.categoryId}
                onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                required
              >
                <option value="">Select category</option>
                {availableCategories.map((cat) => (
                  <option key={cat.categoryId} value={cat.categoryId}>
                    {cat.name}
                  </option>
                ))}
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
              <label>Currency</label>
              <select
                value={formData.currency}
                onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
              >
                <option value="KES">KES (Kenyan Shilling)</option>
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
              </select>
            </div>
          </div>

          {isMpesaMode && (
            <div className="create-giving-group">
              <label>Phone Number (M-Pesa) *</label>
              <input
                type="tel"
                value={formData.phoneNumber}
                onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                placeholder="e.g., 0712345678"
                required
              />
              <small style={{ color: "#6b7280", fontSize: "0.75rem" }}>
                STK push will be sent to this number. Auto-fills from member profile.
              </small>
            </div>
          )}

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
            <button
              type="submit"
              className="create-giving-save"
              disabled={
                loading ||
                (isMpesaMode && (!formData.phoneNumber || !formData.amount)) ||
                (!isMpesaMode && !formData.amount)
              }
            >
              {loading ? "Processing..." : isMpesaMode ? <><FiSend size={16} /> Send STK Push</> : <><FiDollarSign size={16} /> Record Cash</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}