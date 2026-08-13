// File: frontend/src/pages/dashboard/churchadmindashboard/expenses/UpdateExpense.tsx

import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { FiX } from "react-icons/fi";
import { updateExpense, type Expense } from "../../../../Features/expenses/expensesAPI";
import { type ExpenseCategory } from "../../../../Features/expenses/expensesAPI";
import { type Member } from "../../../../Features/members/membersAPI";
import "./UpdateExpense.css";

interface UpdateExpenseProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  expense: Expense;
  categories: ExpenseCategory[];
  members: Member[];
}

export default function UpdateExpense({ isOpen, onClose, onSuccess, expense, categories, members }: UpdateExpenseProps) {
  const token = useSelector((state: any) => state.user.token);
  
  const [formData, setFormData] = useState({
    memberId: "",
    description: "",
    categoryId: "",
    amount: "",
    date: "",
    status: "pending",
    paymentMethod: "",
    notes: "",
    receiptUrl: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (expense) {
      setFormData({
        memberId: expense.memberId?.toString() || "",
        description: expense.description,
        categoryId: expense.categoryId?.toString() || "",
        amount: expense.amount,
        date: expense.date.split("T")[0],
        status: expense.status,
        paymentMethod: expense.paymentMethod || "",
        notes: expense.notes || "",
        receiptUrl: expense.receiptUrl || "",
      });
    }
  }, [expense]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await updateExpense(expense.expenseId, {
        memberId: parseInt(formData.memberId),
        description: formData.description,
        categoryId: formData.categoryId ? parseInt(formData.categoryId) : undefined,
        amount: formData.amount,
        date: new Date(formData.date).toISOString(),
        status: formData.status,
        paymentMethod: formData.paymentMethod || undefined,
        notes: formData.notes || undefined,
        receiptUrl: formData.receiptUrl || undefined,
      }, token);
      onSuccess();
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to update expense");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const availableCategories = categories.filter(c => c.isActive);
  const availableMembers = members.filter(m => m.isActive && m.churchId === expense.churchId);

  return (
    <div className="update-expense-overlay" onClick={onClose}>
      <div className="update-expense-modal" onClick={(e) => e.stopPropagation()}>
        <div className="update-expense-header">
          <h3>Edit Expense</h3>
          <button onClick={onClose} className="update-expense-close">
            <FiX size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="update-expense-form">
          <div className="update-expense-group">
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

          <div className="update-expense-group">
            <label>Description *</label>
            <input
              type="text"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
            />
          </div>

          <div className="update-expense-row">
            <div className="update-expense-group">
              <label>Category</label>
              <select
                value={formData.categoryId}
                onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
              >
                <option value="">Select category</option>
                {availableCategories.map((cat) => (
                  <option key={cat.categoryId} value={cat.categoryId}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="update-expense-group">
              <label>Amount (KES) *</label>
              <input
                type="number"
                step="1"
                min="1"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="update-expense-row">
            <div className="update-expense-group">
              <label>Date *</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                required
              />
            </div>
            <div className="update-expense-group">
              <label>Payment Method</label>
              <select
                value={formData.paymentMethod}
                onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
              >
                <option value="">Select method</option>
                <option value="cash">Cash</option>
                <option value="mpesa">M-Pesa</option>
                <option value="bank">Bank Transfer</option>
                <option value="card">Card</option>
                <option value="check">Check</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          <div className="update-expense-row">
            <div className="update-expense-group">
              <label>Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              >
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
                <option value="paid">Paid</option>
              </select>
            </div>
          </div>

          <div className="update-expense-group">
            <label>Receipt URL</label>
            <input
              type="url"
              value={formData.receiptUrl}
              onChange={(e) => setFormData({ ...formData, receiptUrl: e.target.value })}
            />
          </div>

          <div className="update-expense-group">
            <label>Notes</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={2}
              placeholder="Additional notes"
            />
          </div>

          {error && <div className="update-expense-error">{error}</div>}

          <div className="update-expense-actions">
            <button type="button" onClick={onClose} className="update-expense-cancel">
              Cancel
            </button>
            <button type="submit" className="update-expense-save" disabled={loading}>
              {loading ? "Updating..." : "Update Expense"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}