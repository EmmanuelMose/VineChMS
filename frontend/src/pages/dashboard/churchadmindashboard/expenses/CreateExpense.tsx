import { useState } from "react";
import { useSelector } from "react-redux";
import { FiX } from "react-icons/fi";
import { createExpense } from "../../../../Features/expenses/expensesAPI";
import { type ExpenseCategory } from "../../../../Features/expenses/expensesAPI";
import "./CreateExpense.css";

interface CreateExpenseProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  churchId?: number;
  categories: ExpenseCategory[];
}

export default function CreateExpense({ isOpen, onClose, onSuccess, churchId, categories }: CreateExpenseProps) {
  const token = useSelector((state: any) => state.user.token);
  
  const [formData, setFormData] = useState({
    description: "",
    categoryId: "",
    amount: "",
    date: new Date().toISOString().split("T")[0],
    status: "pending",
    notes: "",
    receiptUrl: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await createExpense({
        churchId: Number(churchId),
        description: formData.description,
        categoryId: formData.categoryId ? parseInt(formData.categoryId) : undefined,
        amount: formData.amount,
        date: new Date(formData.date).toISOString(),
        status: formData.status,
        notes: formData.notes || undefined,
        receiptUrl: formData.receiptUrl || undefined,
      }, token);
      
      setFormData({
        description: "",
        categoryId: "",
        amount: "",
        date: new Date().toISOString().split("T")[0],
        status: "pending",
        notes: "",
        receiptUrl: "",
      });
      onSuccess();
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to create expense");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const availableCategories = categories.filter(c => c.isActive);

  return (
    <div className="create-expense-overlay" onClick={onClose}>
      <div className="create-expense-modal" onClick={(e) => e.stopPropagation()}>
        <div className="create-expense-header">
          <h3>Add Expense</h3>
          <button onClick={onClose} className="create-expense-close">
            <FiX size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="create-expense-form">
          <div className="create-expense-group">
            <label>Description *</label>
            <input
              type="text"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Enter expense description"
              required
            />
          </div>

          <div className="create-expense-row">
            <div className="create-expense-group">
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
            <div className="create-expense-group">
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

          <div className="create-expense-row">
            <div className="create-expense-group">
              <label>Date *</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                required
              />
            </div>
            <div className="create-expense-group">
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

          <div className="create-expense-group">
            <label>Receipt URL</label>
            <input
              type="url"
              value={formData.receiptUrl}
              onChange={(e) => setFormData({ ...formData, receiptUrl: e.target.value })}
              placeholder="https://example.com/receipt.jpg"
            />
          </div>

          <div className="create-expense-group">
            <label>Notes</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={2}
              placeholder="Additional notes"
            />
          </div>

          {error && <div className="create-expense-error">{error}</div>}

          <div className="create-expense-actions">
            <button type="button" onClick={onClose} className="create-expense-cancel">
              Cancel
            </button>
            <button type="submit" className="create-expense-save" disabled={loading}>
              {loading ? "Creating..." : "Add Expense"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}