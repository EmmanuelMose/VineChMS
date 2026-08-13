// File: frontend/src/pages/dashboard/churchadmindashboard/pledges/CreatePledge.tsx

import { useState } from "react";
import { useSelector } from "react-redux";
import { FiX } from "react-icons/fi";
import { createPledge } from "../../../../Features/pledges/pledgesAPI";
import { type Member } from "../../../../Features/members/membersAPI";
import { type GivingCategory } from "../../../../Features/giving/givingAPI";
import { type ExpenseCategory } from "../../../../Features/expenses/expensesAPI";
import "./CreatePledge.css";

interface CreatePledgeProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  churchId?: number;
  members: Member[];
  givingCategories: GivingCategory[];
  expenseCategories: ExpenseCategory[];
}

export default function CreatePledge({ 
  isOpen, 
  onClose, 
  onSuccess, 
  churchId, 
  members,
  givingCategories,
  expenseCategories
}: CreatePledgeProps) {
  const token = useSelector((state: any) => state.user.token);
  
  const [formData, setFormData] = useState({
    memberId: "",
    categoryType: "giving",
    categoryId: "",
    amount: "",
    startDate: new Date().toISOString().split("T")[0],
    endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split("T")[0],
    frequency: "monthly",
    notes: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const payload = {
        memberId: parseInt(formData.memberId),
        churchId: Number(churchId),
        categoryId: formData.categoryId ? parseInt(formData.categoryId) : undefined,
        categoryType: formData.categoryType as "giving" | "expense",
        amount: formData.amount,
        currency: "KES",
        startDate: new Date(formData.startDate).toISOString(),
        endDate: new Date(formData.endDate).toISOString(),
        frequency: formData.frequency,
        notes: formData.notes || undefined,
      };

      await createPledge(payload, token);
      
      setFormData({
        memberId: "",
        categoryType: "giving",
        categoryId: "",
        amount: "",
        startDate: new Date().toISOString().split("T")[0],
        endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split("T")[0],
        frequency: "monthly",
        notes: "",
      });
      onSuccess();
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to create pledge");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const availableMembers = members.filter(m => m.isActive && m.churchId === churchId);
  const availableGivingCategories = givingCategories.filter(c => c.isActive);
  const availableExpenseCategories = expenseCategories.filter(c => c.isActive);
  
  const availableCategories = formData.categoryType === "giving" 
    ? availableGivingCategories.map(c => ({ ...c, type: "giving" as const }))
    : availableExpenseCategories.map(c => ({ ...c, type: "expense" as const }));

  return (
    <div className="pledges-modal-overlay" onClick={onClose}>
      <div className="pledges-modal" onClick={(e) => e.stopPropagation()}>
        <div className="pledges-modal-header">
          <h3>Create Pledge</h3>
          <button onClick={onClose} className="pledges-modal-close">
            <FiX size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="pledges-modal-form">
          <div className="pledges-form-row">
            <div className="pledges-form-group">
              <label>Member *</label>
              <select
                value={formData.memberId}
                onChange={(e) => setFormData({ ...formData, memberId: e.target.value })}
                required
              >
                <option value="">Select member</option>
                {availableMembers.map((m) => (
                  <option key={m.memberId} value={m.memberId}>
                    {m.fullName} ({m.email})
                  </option>
                ))}
              </select>
            </div>
            <div className="pledges-form-group">
              <label>Category Type</label>
              <select
                value={formData.categoryType}
                onChange={(e) => setFormData({ ...formData, categoryType: e.target.value, categoryId: "" })}
              >
                <option value="giving">Giving</option>
                <option value="expense">Expense</option>
              </select>
            </div>
          </div>

          <div className="pledges-form-row">
            <div className="pledges-form-group">
              <label>Category</label>
              <select
                value={formData.categoryId}
                onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
              >
                <option value="">Select category</option>
                {availableCategories.map((c) => (
                  <option key={c.categoryId} value={c.categoryId}>
                    {c.name} ({c.type})
                  </option>
                ))}
              </select>
            </div>
            <div className="pledges-form-group">
              <label>Amount (KES) *</label>
              <input
                type="number"
                step="1"
                min="1"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                placeholder="0.00"
                required
              />
            </div>
          </div>

          <div className="pledges-form-row">
            <div className="pledges-form-group">
              <label>Frequency</label>
              <select
                value={formData.frequency}
                onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
              >
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="quarterly">Quarterly</option>
                <option value="annually">Annually</option>
                <option value="one_time">One Time</option>
              </select>
            </div>
          </div>

          <div className="pledges-form-row">
            <div className="pledges-form-group">
              <label>Start Date *</label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                required
              />
            </div>
            <div className="pledges-form-group">
              <label>End Date *</label>
              <input
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="pledges-form-group">
            <label>Notes</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={2}
              placeholder="Additional notes..."
            />
          </div>

          {error && <div className="pledges-form-error">{error}</div>}

          <div className="pledges-modal-actions">
            <button type="button" className="pledges-modal-cancel" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="pledges-modal-submit" disabled={loading}>
              {loading ? "Creating..." : "Create Pledge"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}