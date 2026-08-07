import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { FiSearch, FiX, FiPlus, FiEdit2, FiTrash2, FiTag, FiCheckCircle, FiXCircle } from "react-icons/fi";
import { fetchExpenses, deleteExpense, approveExpense, rejectExpense, type Expense } from "../../../../Features/expenses/expensesAPI";
import { fetchExpenseCategories, type ExpenseCategory } from "../../../../Features/expenses/expensesAPI";
import CreateExpense from "./CreateExpense";
import UpdateExpense from "./UpdateExpense";
import ExpenseCategories from "./ExpenseCategories";
import "./Expenses.css";

export default function Expenses() {
  const token = useSelector((state: any) => state.user.token);
  const churchId = useSelector((state: any) => state.user.user?.churchId);
  
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [categories, setCategories] = useState<ExpenseCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);
  const [showCategories, setShowCategories] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [expensesData, categoriesData] = await Promise.all([
        fetchExpenses(token),
        fetchExpenseCategories(token),
      ]);
      const filteredExpenses = expensesData.filter(e => e.churchId === churchId);
      const filteredCategories = categoriesData.filter(c => c.churchId === churchId);
      setExpenses(filteredExpenses);
      setCategories(filteredCategories);
    } catch (error) {
      console.error("Failed to load data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (id: number) => {
    setDeleteTargetId(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (deleteTargetId) {
      try {
        await deleteExpense(deleteTargetId, token);
        await loadData();
        setShowDeleteModal(false);
        setDeleteTargetId(null);
      } catch (error) {
        console.error("Failed to delete expense:", error);
      }
    }
  };

  const handleEdit = (expense: Expense) => {
    setSelectedExpense(expense);
    setUpdateModalOpen(true);
  };

  const handleApprove = async (id: number) => {
    try {
      await approveExpense(id, token);
      await loadData();
    } catch (error) {
      console.error("Failed to approve expense:", error);
    }
  };

  const handleReject = async (id: number) => {
    try {
      await rejectExpense(id, token);
      await loadData();
    } catch (error) {
      console.error("Failed to reject expense:", error);
    }
  };

  const handleSuccess = () => {
    loadData();
    setCreateModalOpen(false);
    setUpdateModalOpen(false);
    setSelectedExpense(null);
  };

  const getCategoryName = (categoryId?: number) => {
    if (!categoryId) return "Uncategorized";
    const category = categories.find(c => c.categoryId === categoryId);
    return category ? category.name : "Unknown";
  };

  const formatCurrency = (amount: string) => {
    const num = parseFloat(amount);
    if (isNaN(num)) return "$0.00";
    return "$" + num.toFixed(2);
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: "status-pending",
      approved: "status-approved",
      rejected: "status-rejected",
      paid: "status-paid",
    };
    return colors[status] || "status-pending";
  };

  const filteredExpenses = expenses.filter(expense => {
    const matchesSearch = 
      expense.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      getCategoryName(expense.categoryId).toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === "all" || expense.status === filterStatus;
    const matchesCategory = filterCategory === "all" || expense.categoryId === parseInt(filterCategory);
    
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const stats = {
    total: expenses.reduce((sum, e) => sum + parseFloat(e.amount), 0),
    pending: expenses.filter(e => e.status === "pending").reduce((sum, e) => sum + parseFloat(e.amount), 0),
    approved: expenses.filter(e => e.status === "approved").reduce((sum, e) => sum + parseFloat(e.amount), 0),
    rejected: expenses.filter(e => e.status === "rejected").reduce((sum, e) => sum + parseFloat(e.amount), 0),
    paid: expenses.filter(e => e.status === "paid").reduce((sum, e) => sum + parseFloat(e.amount), 0),
    count: expenses.length,
  };

  if (loading) {
    return (
      <div className="expenses-loading">
        <div className="expenses-loading-spinner"></div>
        <p>Loading expenses...</p>
      </div>
    );
  }

  if (showCategories) {
    return (
      <ExpenseCategories
        onBack={() => setShowCategories(false)}
        token={token}
        churchId={churchId!}
      />
    );
  }

  return (
    <div className="expenses-page">
      {showDeleteModal && (
        <div className="expenses-modal-overlay" onClick={() => setShowDeleteModal(false)}>
          <div className="expenses-modal expenses-modal-confirm" onClick={(e) => e.stopPropagation()}>
            <div className="expenses-modal-header">
              <h3>Delete Expense</h3>
              <button onClick={() => setShowDeleteModal(false)} className="expenses-modal-close">
                <FiX size={20} />
              </button>
            </div>
            <div className="expenses-modal-body">
              <p>Are you sure you want to permanently delete this expense record?</p>
              <p className="expenses-modal-warning">This action cannot be undone.</p>
            </div>
            <div className="expenses-modal-actions">
              <button onClick={() => setShowDeleteModal(false)} className="expenses-btn-cancel">
                Cancel
              </button>
              <button onClick={confirmDelete} className="expenses-btn-danger">
                Delete Permanently
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="expenses-header">
        <div>
          <h2 className="expenses-title">Expenses</h2>
          <p className="expenses-subtitle">Track and manage church expenses</p>
        </div>
        <div className="expenses-actions">
          <button onClick={() => setShowCategories(true)} className="expenses-btn-secondary">
            <FiTag size={16} />
            Categories
          </button>
          <button onClick={() => setCreateModalOpen(true)} className="expenses-btn-primary">
            <FiPlus size={16} />
            Add Expense
          </button>
        </div>
      </div>

      <div className="expenses-stats-grid">
        <div className="expenses-stat-card stat-total">
          <span className="expenses-stat-value">{formatCurrency(stats.total.toString())}</span>
          <span className="expenses-stat-label">Total Expenses</span>
        </div>
        <div className="expenses-stat-card stat-pending">
          <span className="expenses-stat-value">{formatCurrency(stats.pending.toString())}</span>
          <span className="expenses-stat-label">Pending</span>
        </div>
        <div className="expenses-stat-card stat-approved">
          <span className="expenses-stat-value">{formatCurrency(stats.approved.toString())}</span>
          <span className="expenses-stat-label">Approved</span>
        </div>
        <div className="expenses-stat-card stat-paid">
          <span className="expenses-stat-value">{formatCurrency(stats.paid.toString())}</span>
          <span className="expenses-stat-label">Paid</span>
        </div>
        <div className="expenses-stat-card stat-rejected">
          <span className="expenses-stat-value">{formatCurrency(stats.rejected.toString())}</span>
          <span className="expenses-stat-label">Rejected</span>
        </div>
        <div className="expenses-stat-card stat-count">
          <span className="expenses-stat-value">{stats.count}</span>
          <span className="expenses-stat-label">Total Records</span>
        </div>
      </div>

      <div className="expenses-toolbar">
        <div className="expenses-search">
          <FiSearch className="expenses-search-icon" />
          <input
            type="text"
            placeholder="Search expenses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="expenses-search-input"
          />
          {searchTerm && (
            <button onClick={() => setSearchTerm("")} className="expenses-search-clear">
              <FiX size={16} />
            </button>
          )}
        </div>
        <div className="expenses-filters">
          <select 
            value={filterStatus} 
            onChange={(e) => setFilterStatus(e.target.value)}
            className="expenses-filter-select"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="paid">Paid</option>
          </select>
          <select 
            value={filterCategory} 
            onChange={(e) => setFilterCategory(e.target.value)}
            className="expenses-filter-select"
          >
            <option value="all">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.categoryId} value={cat.categoryId}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="expenses-table-wrapper">
        <table className="expenses-table">
          <thead>
            <tr>
              <th>Description</th>
              <th>Category</th>
              <th>Amount</th>
              <th>Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredExpenses.map((expense) => (
              <tr key={expense.expenseId}>
                <td className="expenses-description">{expense.description}</td>
                <td>{getCategoryName(expense.categoryId)}</td>
                <td className="expenses-amount">{formatCurrency(expense.amount)}</td>
                <td>{new Date(expense.date).toLocaleDateString()}</td>
                <td>
                  <span className={`expenses-status-badge ${getStatusColor(expense.status)}`}>
                    {expense.status}
                  </span>
                </td>
                <td>
                  <div className="expenses-actions-cell">
                    {expense.status === "pending" && (
                      <>
                        <button onClick={() => handleApprove(expense.expenseId)} className="expenses-action-btn expenses-action-approve" title="Approve">
                          <FiCheckCircle size={16} />
                        </button>
                        <button onClick={() => handleReject(expense.expenseId)} className="expenses-action-btn expenses-action-reject" title="Reject">
                          <FiXCircle size={16} />
                        </button>
                      </>
                    )}
                    <button onClick={() => handleEdit(expense)} className="expenses-action-btn expenses-action-edit" title="Edit">
                      <FiEdit2 size={16} />
                    </button>
                    <button onClick={() => handleDeleteClick(expense.expenseId)} className="expenses-action-btn expenses-action-delete" title="Delete">
                      <FiTrash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filteredExpenses.length === 0 && (
              <tr>
                <td colSpan={6} className="expenses-empty">
                  No expenses found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <CreateExpense
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSuccess={handleSuccess}
        churchId={churchId}
        categories={categories}
      />

      {selectedExpense && (
        <UpdateExpense
          isOpen={updateModalOpen}
          onClose={() => {
            setUpdateModalOpen(false);
            setSelectedExpense(null);
          }}
          onSuccess={handleSuccess}
          expense={selectedExpense}
          categories={categories}
        />
      )}
    </div>
  );
}