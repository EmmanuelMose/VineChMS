import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { FiX } from "react-icons/fi";
import { updateExpense, type Expense } from "../../../../Features/expenses/expensesAPI";
import { type ExpenseCategory } from "../../../../Features/expenses/expensesAPI";
import "./UpdateExpense.css";

interface UpdateExpenseProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  expense: Expense;
  categories: ExpenseCategory[];
}

export default function UpdateExpense({ isOpen, onClose, onSuccess, expense, categories }: UpdateExpenseProps) {
  const token = useSelector((state: any) => state.user.token);
  
  const [formData, setFormData] = useState({
    description: "",
    categoryId: "",
    amount: "",
    date: "",
    status: "pending",
    notes: "",
    receiptUrl: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (expense) {
      setFormData({
        description: expense.description,
        categoryId: expense.categoryId?.toString() || "",
        amount: expense.amount,
        date: expense.date.split("T")[0],
        status: expense.status,
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
        description: formData.description,
        categoryId: formData.categoryId ? parseInt(formData.categoryId) : undefined,
        amount: formData.amount,
        date: new Date(formData.date).toISOString(),
        status: formData.status,
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