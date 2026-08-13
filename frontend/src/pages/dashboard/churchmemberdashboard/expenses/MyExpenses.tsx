// File: frontend/src/pages/dashboard/churchmemberdashboard/expenses/MyExpenses.tsx

import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { 
  fetchExpenses, 
  fetchExpenseCategories, 
  deleteExpense,
  approveExpense,
  rejectExpense,
  type Expense,
  type ExpenseCategory
} from "../../../../Features/expenses/expensesAPI";
import { createPledge } from "../../../../Features/pledges/pledgesAPI";
import { fetchMembers, type Member } from "../../../../Features/members/membersAPI";
import { FiEdit2, FiTrash2, FiCheckCircle, FiXCircle, FiDollarSign, FiFilter, FiSend, FiUpload, FiEye, FiX } from "react-icons/fi";
import { hasPermission, type UserRole } from "../../../../utils/permissions";
import CreateMemberExpense from "./CreateMemberExpense";
import UpdateMemberExpense from "./UpdateMemberExpense";
import MemberExpenseCategories from "./MemberExpenseCategories";
import "./MyExpenses.css";

export default function MyExpenses() {
  const token = useSelector((state: any) => state.user.token);
  const churchId = useSelector((state: any) => state.user.user?.churchId);
  const userRole = useSelector((state: any) => state.user.user?.role) as UserRole;
  const currentUserId = useSelector((state: any) => state.user.user?.userId);

  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [categories, setCategories] = useState<ExpenseCategory[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [currentMemberId, setCurrentMemberId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [modalMode, setModalMode] = useState<"mpesa" | "cash">("mpesa");
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
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
  const [showCategories, setShowCategories] = useState(false);
  const [approvingId, setApprovingId] = useState<number | null>(null);
  const [rejectingId, setRejectingId] = useState<number | null>(null);
  const [evidenceModalOpen, setEvidenceModalOpen] = useState(false);
  const [evidenceUrl, setEvidenceUrl] = useState("");

  const canViewAllExpenses = hasPermission(userRole, "view_all_expenses");
  const canManageExpenses = hasPermission(userRole, "manage_expenses");
  const canApproveExpenses = hasPermission(userRole, "approve_expenses");
  const canPledgeToExpenses = hasPermission(userRole, "pledge_to_expenses");
  const canManageCategories = hasPermission(userRole, "manage_expense_categories");
  const canCreateExpenses = hasPermission(userRole, "create_expenses");
  const canUseMpesa = hasPermission(userRole, "create_giving_mpesa");
  const canUseCash = hasPermission(userRole, "create_giving_cash");
  const canCreateForOthers = hasPermission(userRole, "create_giving_for_others");
  const canViewOwnExpenses = hasPermission(userRole, "view_own_expenses");

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (members.length > 0 && currentUserId) {
      const member = members.find((m) => m.userId === currentUserId);
      if (member) {
        setCurrentMemberId(member.memberId);
      }
    }
  }, [members, currentUserId]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [expensesData, categoriesData, membersData] = await Promise.all([
        fetchExpenses(token),
        fetchExpenseCategories(token),
        fetchMembers(token),
      ]);
      const churchExpenses = expensesData.filter((e) => e.churchId === churchId);
      const churchCategories = categoriesData.filter((c) => c.churchId === churchId);
      const churchMembers = membersData.filter((m) => m.churchId === churchId);
      setExpenses(churchExpenses);
      setCategories(churchCategories);
      setMembers(churchMembers);
    } catch (error) {
      console.error("Failed to load expenses:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    filterExpenses();
  }, [expenses, searchTerm, filterCategory, filterStatus]);

  const filterExpenses = () => {
    let filtered = [...expenses];

    if (!canViewAllExpenses && !canViewOwnExpenses) {
      setFilteredExpenses([]);
      return;
    }

    if (!canViewAllExpenses && currentMemberId) {
      filtered = filtered.filter((e) => e.memberId === currentMemberId);
    }

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
    setApprovingId(id);
    try {
      await approveExpense(id, token);
      await loadData();
    } catch (error) {
      console.error("Failed to approve expense:", error);
      alert("Failed to approve expense.");
    } finally {
      setApprovingId(null);
    }
  };

  const handleReject = async (id: number) => {
    setRejectingId(id);
    try {
      await rejectExpense(id, token);
      await loadData();
    } catch (error) {
      console.error("Failed to reject expense:", error);
      alert("Failed to reject expense.");
    } finally {
      setRejectingId(null);
    }
  };

  const handlePledge = (expenseId: number) => {
    setPledgeExpenseId(expenseId);
    setPledgeAmount("");
    setPledgeNotes("");
    setShowPledgeModal(true);
  };

  const submitPledge = async () => {
    if (!pledgeExpenseId || !pledgeAmount) {
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
        memberId: expense.memberId!,
        churchId: churchId!,
        amount: pledgeAmount,
        startDate: new Date().toISOString(),
        endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString(),
        frequency: "one_time",
        notes: `Pledge for expense: ${expense.description} - ${pledgeNotes || "No additional notes"}`,
      }, token);

      alert(`✅ You have successfully pledged KES ${parseFloat(pledgeAmount).toFixed(2)} for this expense!`);
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
    if (isNaN(num)) return "KES 0.00";
    return `KES ${num.toFixed(2)}`;
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

  const getMemberName = (memberId?: number) => {
    if (!memberId) return "Unknown";
    const member = members.find((m) => m.memberId === memberId);
    return member ? member.fullName : "Unknown";
  };

  const getMemberEmail = (memberId?: number) => {
    if (!memberId) return "";
    const member = members.find((m) => m.memberId === memberId);
    return member ? member.email : "";
  };

  const getMemberProfilePicture = (memberId?: number) => {
    if (!memberId) return null;
    const member = members.find((m) => m.memberId === memberId);
    return member?.profilePicture || null;
  };

  const openEvidenceModal = (url: string) => {
    setEvidenceUrl(url);
    setEvidenceModalOpen(true);
  };

  if (loading) {
    return (
      <div className="my-expenses-loading">
        <div className="my-expenses-loading-spinner"></div>
        <p>Loading expenses...</p>
      </div>
    );
  }

  if (showCategories) {
    return (
      <MemberExpenseCategories
        onBack={() => setShowCategories(false)}
        token={token}
        churchId={churchId!}
        userRole={userRole}
      />
    );
  }

  const totalAmount = expenses.reduce((sum, e) => sum + parseFloat(e.amount), 0);
  const pendingAmount = expenses.filter(e => e.status === 'pending').reduce((sum, e) => sum + parseFloat(e.amount), 0);
  const approvedAmount = expenses.filter(e => e.status === 'approved').reduce((sum, e) => sum + parseFloat(e.amount), 0);

  return (
    <div className="my-expenses-page">
      {evidenceModalOpen && (
        <div className="my-expenses-modal-overlay" onClick={() => setEvidenceModalOpen(false)}>
          <div className="my-expenses-modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: "90vw", padding: "0.5rem" }}>
            <button
              onClick={() => setEvidenceModalOpen(false)}
              style={{
                position: "absolute",
                top: "12px",
                right: "12px",
                background: "rgba(0,0,0,0.6)",
                border: "none",
                borderRadius: "50%",
                width: "40px",
                height: "40px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                cursor: "pointer",
                zIndex: 10,
              }}
            >
              <FiX size={24} />
            </button>
            <img src={evidenceUrl} alt="Evidence" style={{ maxWidth: "100%", maxHeight: "85vh", display: "block", margin: "0 auto" }} />
          </div>
        </div>
      )}

      {showDeleteModal && (
        <div className="my-expenses-modal-overlay" onClick={() => setShowDeleteModal(false)}>
          <div className="my-expenses-modal my-expenses-modal-small" onClick={(e) => e.stopPropagation()}>
            <div className="my-expenses-modal-header">
              <h3>Delete Expense</h3>
              <button className="my-expenses-modal-close" onClick={() => setShowDeleteModal(false)}>
                Close
              </button>
            </div>
            <div className="my-expenses-modal-body">
              <p>Are you sure you want to permanently delete this expense?</p>
              <p className="my-expenses-modal-warning">This action cannot be undone.</p>
            </div>
            <div className="my-expenses-modal-actions">
              <button className="my-expenses-modal-cancel" onClick={() => setShowDeleteModal(false)}>
                Cancel
              </button>
              <button className="my-expenses-modal-danger" onClick={handleDelete}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {showPledgeModal && canPledgeToExpenses && (
        <div className="my-expenses-modal-overlay" onClick={() => setShowPledgeModal(false)}>
          <div className="my-expenses-modal my-expenses-pledge-modal" onClick={(e) => e.stopPropagation()}>
            <div className="my-expenses-modal-header">
              <h3>Pledge to Pay for Expense</h3>
              <button className="my-expenses-modal-close" onClick={() => setShowPledgeModal(false)}>
                Close
              </button>
            </div>
            <div className="my-expenses-modal-body">
              <div className="my-expenses-pledge-info">
                <p><strong>Expense:</strong> {expenses.find(e => e.expenseId === pledgeExpenseId)?.description}</p>
                <p><strong>Total Amount:</strong> {formatCurrency(expenses.find(e => e.expenseId === pledgeExpenseId)?.amount || "0")}</p>
              </div>
              <div className="my-expenses-form-group">
                <label>Amount You Want to Pledge *</label>
                <div className="my-expenses-pledge-amount-input">
                  <FiDollarSign className="my-expenses-pledge-amount-icon" />
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
              <div className="my-expenses-form-group">
                <label>Notes (Optional)</label>
                <textarea
                  value={pledgeNotes}
                  onChange={(e) => setPledgeNotes(e.target.value)}
                  rows={2}
                  placeholder="Add any notes about your pledge..."
                />
              </div>
            </div>
            <div className="my-expenses-modal-actions">
              <button type="button" className="my-expenses-modal-cancel" onClick={() => setShowPledgeModal(false)}>
                Cancel
              </button>
              <button type="button" className="my-expenses-modal-submit" onClick={submitPledge} disabled={!pledgeAmount || pledgeSubmitting}>
                {pledgeSubmitting ? "Processing..." : "Submit Pledge"}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="my-expenses-header">
        <div>
          <h2 className="my-expenses-title">My Expenses</h2>
          <p className="my-expenses-subtitle">Track, manage, and pledge to church expenses</p>
        </div>
        <div className="my-expenses-header-actions">
          {canManageCategories && (
            <button 
              className="my-expenses-btn-categories" 
              onClick={() => setShowCategories(true)}
            >
              <FiFilter size={16} />
              Categories
            </button>
          )}
          {(canUseMpesa || canUseCash) && (canCreateExpenses || canCreateForOthers) && (
            <>
              {canUseMpesa && (
                <button
                  onClick={() => { setModalMode("mpesa"); setShowCreateModal(true); }}
                  className="my-expenses-btn-primary"
                >
                  <FiSend size={16} />
                  Pay via M-Pesa
                </button>
              )}
              {canUseCash && (
                <button
                  onClick={() => { setModalMode("cash"); setShowCreateModal(true); }}
                  className="my-expenses-btn-secondary"
                >
                  <FiUpload size={16} />
                  Cash with Evidence
                </button>
              )}
            </>
          )}
        </div>
      </div>

      <div className="my-expenses-stats">
        <div className="my-expenses-stat">
          <span className="my-expenses-stat-value">{expenses.length}</span>
          <span className="my-expenses-stat-label">Total Expenses</span>
        </div>
        <div className="my-expenses-stat">
          <span className="my-expenses-stat-value">{formatCurrency(totalAmount.toString())}</span>
          <span className="my-expenses-stat-label">Total Amount</span>
        </div>
        <div className="my-expenses-stat">
          <span className="my-expenses-stat-value">{formatCurrency(pendingAmount.toString())}</span>
          <span className="my-expenses-stat-label">Pending</span>
        </div>
        <div className="my-expenses-stat">
          <span className="my-expenses-stat-value">{formatCurrency(approvedAmount.toString())}</span>
          <span className="my-expenses-stat-label">Approved</span>
        </div>
      </div>

      <div className="my-expenses-filters">
        <div className="my-expenses-filter-group">
          <label>Search</label>
          <input
            type="text"
            placeholder="Search expenses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="my-expenses-filter-group">
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
        <div className="my-expenses-filter-group">
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

      <div className="my-expenses-cards-grid">
        {filteredExpenses.length === 0 ? (
          <div className="my-expenses-empty">
            <p>No expenses found</p>
            <span>Try adjusting your filters</span>
          </div>
        ) : (
          filteredExpenses.map((expense) => {
            const profilePic = getMemberProfilePicture(expense.memberId);
            const isPending = expense.status === "pending";
            const isMpesa = expense.paymentMethod === "mpesa";
            const hasEvidence = expense.receiptUrl && !isMpesa;

            return (
              <div key={expense.expenseId} className="my-expenses-card">
                <div className="my-expenses-card-header">
                  <div className="my-expenses-card-member">
                    {profilePic ? (
                      <div className="my-expenses-card-avatar">
                        <img src={profilePic} alt={getMemberName(expense.memberId)} />
                      </div>
                    ) : (
                      <div className="my-expenses-card-avatar">
                        {getMemberName(expense.memberId).charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div className="my-expenses-card-member-info">
                      <span className="my-expenses-card-member-name">{getMemberName(expense.memberId)}</span>
                      <span className="my-expenses-card-member-email">{getMemberEmail(expense.memberId)}</span>
                    </div>
                  </div>
                  <div className="my-expenses-card-status-badge">
                    <span className={`my-expenses-status-badge status-${expense.status}`}>
                      {expense.status}
                    </span>
                  </div>
                </div>

                <div className="my-expenses-card-body">
                  <div className="my-expenses-card-details">
                    <div className="my-expenses-card-detail">
                      <label>Description</label>
                      <span>{expense.description}</span>
                    </div>
                    <div className="my-expenses-card-detail">
                      <label>Category</label>
                      <span>{getCategoryName(expense.categoryId)}</span>
                    </div>
                    <div className="my-expenses-card-detail">
                      <label>Date</label>
                      <span>{formatDate(expense.date)}</span>
                    </div>
                    <div className="my-expenses-card-detail">
                      <label>Amount</label>
                      <span className="my-expenses-card-amount">{formatCurrency(expense.amount)}</span>
                    </div>
                    <div className="my-expenses-card-detail">
                      <label>Method</label>
                      <span className={`my-expenses-method-badge ${isMpesa ? "method-mpesa" : "method-cash"}`}>
                        {isMpesa ? "M-Pesa" : "Cash"}
                      </span>
                    </div>
                    {isMpesa && isPending && (
                      <div className="my-expenses-card-detail full-width">
                        <label>Status</label>
                        <span className="my-expenses-mpesa-waiting">⏳ Waiting for M-Pesa confirmation...</span>
                      </div>
                    )}
                    {expense.mpesaCheckoutRequestID && (
                      <div className="my-expenses-card-detail full-width">
                        <label>M-Pesa Transaction ID</label>
                        <span style={{ fontSize: "0.75rem", color: "#6b7280" }}>{expense.mpesaCheckoutRequestID}</span>
                      </div>
                    )}
                    {hasEvidence && (
                      <div className="my-expenses-card-detail full-width">
                        <label>Evidence</label>
                        <button
                          className="my-expenses-evidence-btn"
                          onClick={() => openEvidenceModal(expense.receiptUrl!)}
                        >
                          <FiEye size={16} />
                          <span>View Evidence</span>
                        </button>
                      </div>
                    )}
                    {expense.notes && (
                      <div className="my-expenses-card-detail full-width">
                        <label>Notes</label>
                        <span>{expense.notes}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="my-expenses-card-footer">
                  {canManageExpenses && (
                    <button 
                      className="my-expenses-card-btn my-expenses-card-btn-edit" 
                      onClick={() => {
                        setEditingExpense(expense);
                        setShowUpdateModal(true);
                      }}
                    >
                      <FiEdit2 size={14} /> Edit
                    </button>
                  )}
                  {canManageExpenses && (
                    <button
                      className="my-expenses-card-btn my-expenses-card-btn-delete"
                      onClick={() => {
                        setDeleteTargetId(expense.expenseId);
                        setShowDeleteModal(true);
                      }}
                    >
                      <FiTrash2 size={14} /> Delete
                    </button>
                  )}
                  {canApproveExpenses && isPending && (
                    <>
                      <button 
                        className="my-expenses-card-btn my-expenses-card-btn-approve" 
                        onClick={() => handleApprove(expense.expenseId)}
                        disabled={approvingId === expense.expenseId}
                      >
                        {approvingId === expense.expenseId ? "..." : <FiCheckCircle size={14} />}
                        Approve
                      </button>
                      <button 
                        className="my-expenses-card-btn my-expenses-card-btn-reject" 
                        onClick={() => handleReject(expense.expenseId)}
                        disabled={rejectingId === expense.expenseId}
                      >
                        {rejectingId === expense.expenseId ? "..." : <FiXCircle size={14} />}
                        Reject
                      </button>
                    </>
                  )}
                  {canPledgeToExpenses && expense.status === "approved" && (
                    <button
                      className="my-expenses-card-btn my-expenses-card-btn-pledge"
                      onClick={() => handlePledge(expense.expenseId)}
                    >
                      <FiDollarSign size={14} /> Pledge
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      <CreateMemberExpense
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={() => {
          setShowCreateModal(false);
          loadData();
        }}
        categories={categories}
        members={members}
        mode={modalMode}
        currentMemberId={currentMemberId || undefined}
        userRole={userRole}
      />

      {editingExpense && (
        <UpdateMemberExpense
          isOpen={showUpdateModal}
          onClose={() => {
            setShowUpdateModal(false);
            setEditingExpense(null);
          }}
          onSuccess={() => {
            setShowUpdateModal(false);
            setEditingExpense(null);
            loadData();
          }}
          expense={editingExpense}
          categories={categories}
          members={members}
        />
      )}
    </div>
  );
}