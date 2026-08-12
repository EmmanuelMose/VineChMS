import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { 
  fetchExpenses, 
  fetchExpenseCategories, 
  createExpense, 
  updateExpense, 
  deleteExpense,
  approveExpense,
  rejectExpense,
  type Expense,
  type ExpenseCategory
} from "../../../../Features/expenses/expensesAPI";
import { createPledge } from "../../../../Features/pledges/pledgesAPI";
import { fetchMemberByUserId } from "../../../../Features/members/membersAPI";
import { FiPlus, FiEdit2, FiTrash2, FiCheckCircle, FiXCircle, FiDollarSign } from "react-icons/fi";
import { FaHandshake } from "react-icons/fa";
import "./Expenses.css";

export default function Expenses() {
  const token = useSelector((state: any) => state.user.token);
  const churchId = useSelector((state: any) => state.user.user?.churchId);
  const userId = useSelector((state: any) => state.user.user?.userId);
  const userRole = useSelector((state: any) => state.user.user?.role);

  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [categories, setCategories] = useState<ExpenseCategory[]>([]);
  const [memberId, setMemberId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filteredExpenses, setFilteredExpenses] = useState<Expense[]>([]);
  
  const [showPledgeModal, setShowPledgeModal] = useState(false);
  const [pledgeExpenseId, setPledgeExpenseId] = useState<number | null>(null);
  const [pledgeAmount, setPledgeAmount] = useState("");
  const [pledgeNotes, setPledgeNotes] = useState("");
  const [pledgeSubmitting, setPledgeSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    categoryId: "",
    amount: "",
    description: "",
    date: new Date().toISOString().split("T")[0],
    status: "pending",
    notes: "",
  });

  useEffect(() => {
    const loadMemberId = async () => {
      if (token && userId) {
        try {
          const member = await fetchMemberByUserId(userId, token);
          if (member && member.memberId) {
            setMemberId(member.memberId);
          }
        } catch (error) {
          console.error("Failed to load member ID:", error);
        }
      }
    };
    loadMemberId();
  }, [token, userId]);

  useEffect(() => {
    if (memberId) {
      loadData();
    }
  }, [memberId]);

  useEffect(() => {
    filterExpenses();
  }, [expenses, searchTerm, filterCategory, filterStatus]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [expensesData, categoriesData] = await Promise.all([
        fetchExpenses(token),
        fetchExpenseCategories(token),
      ]);
      const churchExpenses = expensesData.filter((e) => e.churchId === churchId);
      const churchCategories = categoriesData.filter((c) => c.churchId === churchId);
      setExpenses(churchExpenses);
      setCategories(churchCategories);
    } catch (error) {
      console.error("Failed to load expenses:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterExpenses = () => {
    let filtered = [...expenses];

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (e) =>
          e.description.toLowerCase().includes(term) ||
          (e.notes || "").toLowerCase().includes(term)
      );
    }

    if (filterCategory !== "all") {
      filtered = filtered.filter((e) => e.categoryId === parseInt(filterCategory));
    }

    if (filterStatus !== "all") {
      filtered = filtered.filter((e) => e.status === filterStatus);
    }

    setFilteredExpenses(filtered);
  };

  const canManage = userRole === "treasurer" || userRole === "church_admin";
  const canApprove = userRole === "pastor" || userRole === "elder" || userRole === "treasurer" || userRole === "church_admin";
  const canPledge = userRole === "church_member" || userRole === "pastor" || userRole === "elder" || userRole === "treasurer" || userRole === "secretary" || userRole === "church_admin";

  const handleCreate = () => {
    setEditingExpense(null);
    setFormData({
      categoryId: "",
      amount: "",
      description: "",
      date: new Date().toISOString().split("T")[0],
      status: "pending",
      notes: "",
    });
    setShowModal(true);
  };

  const handleEdit = (expense: Expense) => {
    setEditingExpense(expense);
    const date = new Date(expense.date);
    setFormData({
      categoryId: expense.categoryId?.toString() || "",
      amount: expense.amount,
      description: expense.description,
      date: date.toISOString().split("T")[0],
      status: expense.status,
      notes: expense.notes || "",
    });
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        churchId: churchId!,
        categoryId: formData.categoryId ? parseInt(formData.categoryId) : undefined,
        amount: formData.amount,
        description: formData.description,
        date: new Date(formData.date).toISOString(),
        status: formData.status,
        notes: formData.notes || undefined,
      };

      if (editingExpense) {
        await updateExpense(editingExpense.expenseId, payload, token);
      } else {
        await createExpense(payload, token);
      }
      setShowModal(false);
      await loadData();
    } catch (error: any) {
      console.error("Failed to save expense:", error);
      alert(error.response?.data?.message || "Failed to save expense.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTargetId) return;
    try {
      await deleteExpense(deleteTargetId, token);
      setShowDeleteModal(false);
      setDeleteTargetId(null);
      await loadData();
    } catch (error) {
      console.error("Failed to delete expense:", error);
      alert("Failed to delete expense.");
    }
  };

  const handleApprove = async (id: number) => {
    try {
      await approveExpense(id, token);
      await loadData();
    } catch (error) {
      console.error("Failed to approve expense:", error);
      alert("Failed to approve expense.");
    }
  };

  const handleReject = async (id: number) => {
    try {
      await rejectExpense(id, token);
      await loadData();
    } catch (error) {
      console.error("Failed to reject expense:", error);
      alert("Failed to reject expense.");
    }
  };

  const handlePledge = (expenseId: number) => {
    setPledgeExpenseId(expenseId);
    setPledgeAmount("");
    setPledgeNotes("");
    setShowPledgeModal(true);
  };

  const submitPledge = async () => {
    if (!pledgeExpenseId || !memberId || !pledgeAmount) {
      alert("Please fill in all required fields.");
      return;
    }

    setPledgeSubmitting(true);
    try {
      const expense = expenses.find(e => e.expenseId === pledgeExpenseId);
      if (!expense) {
        alert("Expense not found.");
        return;
      }

      await createPledge({
        memberId: memberId,
        churchId: churchId!,
        amount: pledgeAmount,
        startDate: new Date().toISOString(),
        endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString(),
        frequency: "one_time",
        notes: `Pledge for expense: ${expense.description} - ${pledgeNotes || "No additional notes"}`,
      }, token);

      alert(`✅ You have successfully pledged $${parseFloat(pledgeAmount).toFixed(2)} for this expense!`);
      setShowPledgeModal(false);
      setPledgeExpenseId(null);
      setPledgeAmount("");
      setPledgeNotes("");
      await loadData();
    } catch (error: any) {
      console.error("Failed to create pledge:", error);
      alert(error.response?.data?.message || "Failed to create pledge. Please try again.");
    } finally {
      setPledgeSubmitting(false);
    }
  };

  const formatCurrency = (amount: string) => {
    const num = parseFloat(amount);
    if (isNaN(num)) return "$0.00";
    return "$" + num.toFixed(2);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getCategoryName = (categoryId?: number) => {
    if (!categoryId) return "Uncategorized";
    const cat = categories.find((c) => c.categoryId === categoryId);
    return cat ? cat.name : "Unknown";
  };

  if (loading) {
    return (
      <div className="member-expenses-loading">
        <div className="member-expenses-loading-spinner"></div>
        <p>Loading expenses...</p>
      </div>
    );
  }

  const totalAmount = expenses.reduce((sum, e) => sum + parseFloat(e.amount), 0);
  const pendingAmount = expenses.filter(e => e.status === 'pending').reduce((sum, e) => sum + parseFloat(e.amount), 0);
  const approvedAmount = expenses.filter(e => e.status === 'approved').reduce((sum, e) => sum + parseFloat(e.amount), 0);

  return (
    <div className="member-expenses-page">
      <div className="member-expenses-header">
        <div>
          <h2 className="member-expenses-title">Expenses</h2>
          <p className="member-expenses-subtitle">Track, manage, and pledge to church expenses</p>
        </div>
        {canManage && (
          <button className="member-expenses-add-btn" onClick={handleCreate}>
            <FiPlus size={18} />
            Create Expense
          </button>
        )}
      </div>

      <div className="member-expenses-stats">
        <div className="member-expenses-stat">
          <span className="member-expenses-stat-value">{expenses.length}</span>
          <span className="member-expenses-stat-label">Total Expenses</span>
        </div>
        <div className="member-expenses-stat">
          <span className="member-expenses-stat-value">{formatCurrency(totalAmount.toString())}</span>
          <span className="member-expenses-stat-label">Total Amount</span>
        </div>
        <div className="member-expenses-stat">
          <span className="member-expenses-stat-value">{formatCurrency(pendingAmount.toString())}</span>
          <span className="member-expenses-stat-label">Pending</span>
        </div>
        <div className="member-expenses-stat">
          <span className="member-expenses-stat-value">{formatCurrency(approvedAmount.toString())}</span>
          <span className="member-expenses-stat-label">Approved</span>
        </div>
      </div>

      <div className="member-expenses-filters">
        <div className="member-expenses-filter-group">
          <label>Search</label>
          <input
            type="text"
            placeholder="Search expenses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="member-expenses-filter-group">
          <label>Category</label>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
          >
            <option value="all">All Categories</option>
            {categories.map((c) => (
              <option key={c.categoryId} value={c.categoryId}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <div className="member-expenses-filter-group">
          <label>Status</label>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="paid">Paid</option>
          </select>
        </div>
      </div>

      <div className="member-expenses-table-wrapper">
        {filteredExpenses.length > 0 ? (
          <table className="member-expenses-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Description</th>
                <th>Category</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredExpenses.map((expense) => (
                <tr key={expense.expenseId}>
                  <td>{formatDate(expense.date)}</td>
                  <td>{expense.description}</td>
                  <td>{getCategoryName(expense.categoryId)}</td>
                  <td className="member-expenses-amount">{formatCurrency(expense.amount)}</td>
                  <td>
                    <span className={`member-expenses-status status-${expense.status}`}>
                      {expense.status}
                    </span>
                  </td>
                  <td>
                    <div className="member-expenses-actions">
                      {canPledge && expense.status === "approved" && (
                        <button
                          className="member-expenses-action-pledge"
                          onClick={() => handlePledge(expense.expenseId)}
                          title="Pledge to pay for this expense"
                        >
                          <FaHandshake size={14} /> Pledge
                        </button>
                      )}
                      {canManage && (
                        <>
                          <button className="member-expenses-action-edit" onClick={() => handleEdit(expense)}>
                            <FiEdit2 size={14} /> Edit
                          </button>
                          <button
                            className="member-expenses-action-delete"
                            onClick={() => {
                              setDeleteTargetId(expense.expenseId);
                              setShowDeleteModal(true);
                            }}
                          >
                            <FiTrash2 size={14} /> Delete
                          </button>
                        </>
                      )}
                      {canApprove && expense.status === "pending" && (
                        <>
                          <button className="member-expenses-action-approve" onClick={() => handleApprove(expense.expenseId)}>
                            <FiCheckCircle size={14} /> Approve
                          </button>
                          <button className="member-expenses-action-reject" onClick={() => handleReject(expense.expenseId)}>
                            <FiXCircle size={14} /> Reject
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="member-expenses-empty">
            <p>No expenses found</p>
          </div>
        )}
      </div>

      {showModal && (
        <div className="member-expenses-modal-overlay" onClick={() => setShowModal(false)}>
          <div className="member-expenses-modal" onClick={(e) => e.stopPropagation()}>
            <div className="member-expenses-modal-header">
              <h3>{editingExpense ? "Edit Expense" : "Create Expense"}</h3>
              <button className="member-expenses-modal-close" onClick={() => setShowModal(false)}>
                Close
              </button>
            </div>
            <form onSubmit={handleSubmit} className="member-expenses-modal-form">
              <div className="member-expenses-form-group">
                <label>Description *</label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                />
              </div>
              <div className="member-expenses-form-row">
                <div className="member-expenses-form-group">
                  <label>Category</label>
                  <select
                    value={formData.categoryId}
                    onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                  >
                    <option value="">Select category</option>
                    {categories.filter(c => c.isActive).map((c) => (
                      <option key={c.categoryId} value={c.categoryId}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="member-expenses-form-group">
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
              <div className="member-expenses-form-row">
                <div className="member-expenses-form-group">
                  <label>Date *</label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    required
                  />
                </div>
                <div className="member-expenses-form-group">
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
              <div className="member-expenses-form-group">
                <label>Notes</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={2}
                  placeholder="Additional notes..."
                />
              </div>
              <div className="member-expenses-modal-actions">
                <button
                  type="button"
                  className="member-expenses-modal-cancel"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="member-expenses-modal-submit"
                  disabled={submitting}
                >
                  {submitting ? "Saving..." : editingExpense ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showDeleteModal && (
        <div className="member-expenses-modal-overlay" onClick={() => setShowDeleteModal(false)}>
          <div className="member-expenses-modal member-expenses-modal-small" onClick={(e) => e.stopPropagation()}>
            <div className="member-expenses-modal-header">
              <h3>Delete Expense</h3>
              <button className="member-expenses-modal-close" onClick={() => setShowDeleteModal(false)}>
                Close
              </button>
            </div>
            <div className="member-expenses-modal-body">
              <p>Are you sure you want to delete this expense?</p>
              <p className="member-expenses-modal-warning">This action cannot be undone.</p>
            </div>
            <div className="member-expenses-modal-actions">
              <button className="member-expenses-modal-cancel" onClick={() => setShowDeleteModal(false)}>
                Cancel
              </button>
              <button className="member-expenses-modal-danger" onClick={handleDelete}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {showPledgeModal && (
        <div className="member-expenses-modal-overlay" onClick={() => setShowPledgeModal(false)}>
          <div className="member-expenses-modal member-expenses-pledge-modal" onClick={(e) => e.stopPropagation()}>
            <div className="member-expenses-modal-header">
              <h3>Pledge to Pay for Expense</h3>
              <button className="member-expenses-modal-close" onClick={() => setShowPledgeModal(false)}>
                Close
              </button>
            </div>
            <div className="member-expenses-modal-body">
              <div className="member-expenses-pledge-info">
                <p><strong>Expense:</strong> {expenses.find(e => e.expenseId === pledgeExpenseId)?.description}</p>
                <p><strong>Total Amount:</strong> {formatCurrency(expenses.find(e => e.expenseId === pledgeExpenseId)?.amount || "0")}</p>
              </div>
              <div className="member-expenses-form-group">
                <label>Amount You Want to Pledge *</label>
                <div className="member-expenses-pledge-amount-input">
                  <FiDollarSign className="member-expenses-pledge-amount-icon" />
                  <input
                    type="number"
                    step="0.01"
                    min="0.01"
                    value={pledgeAmount}
                    onChange={(e) => setPledgeAmount(e.target.value)}
                    placeholder="0.00"
                    required
                  />
                </div>
              </div>
              <div className="member-expenses-form-group">
                <label>Notes (Optional)</label>
                <textarea
                  value={pledgeNotes}
                  onChange={(e) => setPledgeNotes(e.target.value)}
                  rows={2}
                  placeholder="Add any notes about your pledge..."
                />
              </div>
            </div>
            <div className="member-expenses-modal-actions">
              <button
                type="button"
                className="member-expenses-modal-cancel"
                onClick={() => setShowPledgeModal(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="member-expenses-modal-submit"
                onClick={submitPledge}
                disabled={!pledgeAmount || pledgeSubmitting}
              >
                {pledgeSubmitting ? "Processing..." : "Submit Pledge"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}