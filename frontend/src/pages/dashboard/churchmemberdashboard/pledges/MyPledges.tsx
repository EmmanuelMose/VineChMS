// File: frontend/src/pages/dashboard/churchmemberdashboard/pledges/MyPledges.tsx

import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { 
  fetchPledgesByMember, 
  createPledge, 
  updatePledge, 
  deletePledge, 
  fulfillPledge,
  type Pledge 
} from "../../../../Features/pledges/pledgesAPI";
import { fetchGivingCategories, type GivingCategory } from "../../../../Features/giving/givingAPI";
import { fetchExpenseCategories, type ExpenseCategory } from "../../../../Features/expenses/expensesAPI";
import { fetchMemberByUserId } from "../../../../Features/members/membersAPI";
import { FiPlus, FiEdit2, FiTrash2, FiCheckCircle, FiX, FiDollarSign } from "react-icons/fi";
import { hasPermission, type UserRole } from "../../../../utils/permissions";
import PayMyPledge from "./PayMyPledge";
import "./MyPledges.css";

export default function MyPledges() {
  const token = useSelector((state: any) => state.user.token);
  const churchId = useSelector((state: any) => state.user.user?.churchId);
  const userId = useSelector((state: any) => state.user.user?.userId);
  const userRole = useSelector((state: any) => state.user.user?.role) as UserRole;

  const [pledges, setPledges] = useState<Pledge[]>([]);
  const [givingCategories, setGivingCategories] = useState<GivingCategory[]>([]);
  const [expenseCategories, setExpenseCategories] = useState<ExpenseCategory[]>([]);
  const [memberId, setMemberId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filteredPledges, setFilteredPledges] = useState<Pledge[]>([]);
  
  const [showModal, setShowModal] = useState(false);
  const [editingPledge, setEditingPledge] = useState<Pledge | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);
  const [showPayModal, setShowPayModal] = useState(false);
  const [selectedPledge, setSelectedPledge] = useState<Pledge | null>(null);
  const [profileImageModalOpen, setProfileImageModalOpen] = useState(false);
  const [profileImageUrl, setProfileImageUrl] = useState("");

  const canManagePledges = hasPermission(userRole, "manage_pledges");
  const canFulfill = hasPermission(userRole, "approve_expenses") || userRole === "treasurer" || userRole === "church_admin";

  const [formData, setFormData] = useState({
    categoryType: "giving",
    categoryId: "",
    amount: "",
    startDate: new Date().toISOString().split("T")[0],
    endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split("T")[0],
    frequency: "monthly",
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
    filterPledges();
  }, [pledges, searchTerm, filterStatus]);

  const loadData = async () => {
    if (!memberId || !token) return;
    try {
      setLoading(true);
      const [pledgesData, givingData, expenseData] = await Promise.all([
        fetchPledgesByMember(memberId, token),
        fetchGivingCategories(token),
        fetchExpenseCategories(token),
      ]);
      const churchPledges = pledgesData.filter((p) => p.churchId === churchId);
      const churchGiving = givingData.filter((c) => c.churchId === churchId);
      const churchExpense = expenseData.filter((c) => c.churchId === churchId);
      setPledges(churchPledges);
      setGivingCategories(churchGiving);
      setExpenseCategories(churchExpense);
    } catch (error) {
      console.error("Failed to load pledges:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterPledges = () => {
    let filtered = [...pledges];
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          (p.notes || "").toLowerCase().includes(term) ||
          (p.categoryName || "").toLowerCase().includes(term)
      );
    }
    if (filterStatus === "fulfilled") {
      filtered = filtered.filter((p) => p.isFulfilled);
    } else if (filterStatus === "unfulfilled") {
      filtered = filtered.filter((p) => !p.isFulfilled);
    } else if (filterStatus === "partial") {
      filtered = filtered.filter((p) => !p.isFulfilled && parseFloat(p.amount) > parseFloat(p.paidAmount || "0"));
    }
    setFilteredPledges(filtered);
  };

  const handleCreate = () => {
    setEditingPledge(null);
    setFormData({
      categoryType: "giving",
      categoryId: "",
      amount: "",
      startDate: new Date().toISOString().split("T")[0],
      endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split("T")[0],
      frequency: "monthly",
      notes: "",
    });
    setShowModal(true);
  };

  const handleEdit = (pledge: Pledge) => {
    setEditingPledge(pledge);
    const startDate = new Date(pledge.startDate);
    const endDate = new Date(pledge.endDate);
    setFormData({
      categoryType: pledge.categoryType || "giving",
      categoryId: pledge.categoryId?.toString() || "",
      amount: pledge.amount,
      startDate: startDate.toISOString().split("T")[0],
      endDate: endDate.toISOString().split("T")[0],
      frequency: pledge.frequency,
      notes: pledge.notes || "",
    });
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!memberId) return;
    setSubmitting(true);
    try {
      const payload = {
        memberId: memberId,
        churchId: churchId!,
        categoryId: formData.categoryId ? parseInt(formData.categoryId) : undefined,
        categoryType: formData.categoryType as "giving" | "expense",
        amount: formData.amount,
        startDate: new Date(formData.startDate).toISOString(),
        endDate: new Date(formData.endDate).toISOString(),
        frequency: formData.frequency,
        notes: formData.notes || undefined,
      };

      if (editingPledge) {
        await updatePledge(editingPledge.pledgeId, payload, token);
      } else {
        await createPledge(payload, token);
      }
      setShowModal(false);
      await loadData();
    } catch (error: any) {
      console.error("Failed to save pledge:", error);
      alert(error.response?.data?.message || "Failed to save pledge.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTargetId) return;
    try {
      await deletePledge(deleteTargetId, token);
      setShowDeleteModal(false);
      setDeleteTargetId(null);
      await loadData();
    } catch (error) {
      console.error("Failed to delete pledge:", error);
      alert("Failed to delete pledge.");
    }
  };

  const handlePayPledge = (pledge: Pledge) => {
    setSelectedPledge(pledge);
    setShowPayModal(true);
  };

  const handleSuccess = () => {
    setShowModal(false);
    setShowPayModal(false);
    setSelectedPledge(null);
    loadData();
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

  const getCategoryName = (categoryId?: number, categoryType?: string) => {
    if (!categoryId) return "Uncategorized";
    if (categoryType === "giving") {
      const cat = givingCategories.find((c) => c.categoryId === categoryId);
      return cat ? cat.name : "Unknown";
    } else {
      const cat = expenseCategories.find((c) => c.categoryId === categoryId);
      return cat ? cat.name : "Unknown";
    }
  };

  const getProgress = (pledge: Pledge) => {
    const total = parseFloat(pledge.amount);
    const paid = parseFloat(pledge.paidAmount || "0");
    if (total === 0) return 0;
    const progress = Math.min((paid / total) * 100, 100);
    return Math.round(progress);
  };


  if (loading) {
    return (
      <div className="member-pledges-loading">
        <div className="member-pledges-loading-spinner"></div>
        <p>Loading pledges...</p>
      </div>
    );
  }

  const totalAmount = pledges.reduce((sum, p) => sum + parseFloat(p.amount), 0);
  const totalPaid = pledges.reduce((sum, p) => sum + parseFloat(p.paidAmount || "0"), 0);

  return (
    <div className="member-pledges-page">
      {profileImageModalOpen && (
        <div className="member-pledges-modal-overlay" onClick={() => setProfileImageModalOpen(false)}>
          <div className="member-pledges-modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: "90vw", padding: "0.5rem" }}>
            <button
              onClick={() => setProfileImageModalOpen(false)}
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
            <img src={profileImageUrl} alt="Profile" style={{ maxWidth: "100%", maxHeight: "85vh", display: "block", margin: "0 auto" }} />
          </div>
        </div>
      )}

      {showDeleteModal && (
        <div className="member-pledges-modal-overlay" onClick={() => setShowDeleteModal(false)}>
          <div className="member-pledges-modal member-pledges-modal-small" onClick={(e) => e.stopPropagation()}>
            <div className="member-pledges-modal-header">
              <h3>Delete Pledge</h3>
              <button className="member-pledges-modal-close" onClick={() => setShowDeleteModal(false)}>
                <FiX size={20} />
              </button>
            </div>
            <div className="member-pledges-modal-body">
              <p>Are you sure you want to delete this pledge?</p>
              <p className="member-pledges-modal-warning">This action cannot be undone.</p>
            </div>
            <div className="member-pledges-modal-actions">
              <button className="member-pledges-modal-cancel" onClick={() => setShowDeleteModal(false)}>
                Cancel
              </button>
              <button className="member-pledges-modal-danger" onClick={handleDelete}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="member-pledges-header">
        <div>
          <h2 className="member-pledges-title">My Pledges</h2>
          <p className="member-pledges-subtitle">View and manage your pledge commitments</p>
        </div>
        {canManagePledges && (
          <button className="member-pledges-add-btn" onClick={handleCreate}>
            <FiPlus size={18} />
            Create Pledge
          </button>
        )}
      </div>

      <div className="member-pledges-stats">
        <div className="member-pledges-stat">
          <span className="member-pledges-stat-value">{pledges.length}</span>
          <span className="member-pledges-stat-label">Total Pledges</span>
        </div>
        <div className="member-pledges-stat">
          <span className="member-pledges-stat-value">{formatCurrency(totalAmount.toString())}</span>
          <span className="member-pledges-stat-label">Total Pledged</span>
        </div>
        <div className="member-pledges-stat">
          <span className="member-pledges-stat-value">{formatCurrency(totalPaid.toString())}</span>
          <span className="member-pledges-stat-label">Total Paid</span>
        </div>
        <div className="member-pledges-stat">
          <span className="member-pledges-stat-value">{pledges.filter(p => p.isFulfilled).length}</span>
          <span className="member-pledges-stat-label">Fulfilled</span>
        </div>
        <div className="member-pledges-stat">
          <span className="member-pledges-stat-value">{pledges.filter(p => !p.isFulfilled).length}</span>
          <span className="member-pledges-stat-label">Pending</span>
        </div>
      </div>

      <div className="member-pledges-filters">
        <div className="member-pledges-filter-group">
          <label>Search</label>
          <input
            type="text"
            placeholder="Search by category or notes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="member-pledges-filter-group">
          <label>Status</label>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">All</option>
            <option value="fulfilled">Fulfilled</option>
            <option value="unfulfilled">Unfulfilled</option>
            <option value="partial">Partial</option>
          </select>
        </div>
      </div>

      <div className="member-pledges-cards-grid">
        {filteredPledges.length === 0 ? (
          <div className="member-pledges-empty">
            <p>No pledges found</p>
            {canManagePledges && <span>Create your first pledge</span>}
          </div>
        ) : (
          filteredPledges.map((pledge) => {
            const progress = getProgress(pledge);
            const paidAmount = parseFloat(pledge.paidAmount || "0");
            const totalAmount = parseFloat(pledge.amount);
            const remaining = totalAmount - paidAmount;
            const isFulfilled = pledge.isFulfilled;

            return (
              <div key={pledge.pledgeId} className="member-pledges-card">
                <div className="member-pledges-card-header">
                  <div className="member-pledges-card-info">
                    <span className="member-pledges-card-category">{getCategoryName(pledge.categoryId, pledge.categoryType)}</span>
                    <span className="member-pledges-card-type">{pledge.categoryType || "giving"}</span>
                  </div>
                  <div className="member-pledges-card-status-badge">
                    <span className={`member-pledges-status-badge ${isFulfilled ? "status-fulfilled" : "status-unfulfilled"}`}>
                      {isFulfilled ? "Fulfilled" : "Pending"}
                    </span>
                  </div>
                </div>

                <div className="member-pledges-card-body">
                  <div className="member-pledges-card-details">
                    <div className="member-pledges-card-detail">
                      <label>Pledged Amount</label>
                      <span className="member-pledges-card-amount">{formatCurrency(pledge.amount)}</span>
                    </div>
                    <div className="member-pledges-card-detail">
                      <label>Paid Amount</label>
                      <span className="member-pledges-card-paid">{formatCurrency(pledge.paidAmount || "0")}</span>
                    </div>
                    <div className="member-pledges-card-detail">
                      <label>Remaining</label>
                      <span className="member-pledges-card-remaining">{formatCurrency(remaining.toString())}</span>
                    </div>
                    <div className="member-pledges-card-detail full-width">
                      <label>Progress</label>
                      <div className="member-pledges-progress-wrapper">
                        <div className="member-pledges-progress-bar">
                          <div 
                            className="member-pledges-progress-fill" 
                            style={{ width: `${progress}%` }}
                          ></div>
                        </div>
                        <span className="member-pledges-progress-text">{progress}%</span>
                      </div>
                    </div>
                    <div className="member-pledges-card-detail">
                      <label>Start Date</label>
                      <span>{formatDate(pledge.startDate)}</span>
                    </div>
                    <div className="member-pledges-card-detail">
                      <label>End Date</label>
                      <span>{formatDate(pledge.endDate)}</span>
                    </div>
                    <div className="member-pledges-card-detail">
                      <label>Frequency</label>
                      <span className="member-pledges-frequency">{pledge.frequency}</span>
                    </div>
                    {pledge.notes && (
                      <div className="member-pledges-card-detail full-width">
                        <label>Notes</label>
                        <span>{pledge.notes}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="member-pledges-card-footer">
                  {canManagePledges && (
                    <button 
                      className="member-pledges-card-btn member-pledges-card-btn-pay" 
                      onClick={() => handlePayPledge(pledge)}
                    >
                      <FiDollarSign size={14} /> Pay Pledge
                    </button>
                  )}
                  {canManagePledges && (
                    <button 
                      className="member-pledges-card-btn member-pledges-card-btn-edit" 
                      onClick={() => handleEdit(pledge)}
                    >
                      <FiEdit2 size={14} /> Edit
                    </button>
                  )}
                  {canManagePledges && (
                    <button
                      className="member-pledges-card-btn member-pledges-card-btn-delete"
                      onClick={() => {
                        setDeleteTargetId(pledge.pledgeId);
                        setShowDeleteModal(true);
                      }}
                    >
                      <FiTrash2 size={14} /> Delete
                    </button>
                  )}
                  {canFulfill && !isFulfilled && (
                    <button
                      className="member-pledges-card-btn member-pledges-card-btn-fulfill"
                      onClick={() => {
                        if (window.confirm("Mark this pledge as fulfilled?")) {
                          fulfillPledge(pledge.pledgeId, token).then(() => loadData());
                        }
                      }}
                    >
                      <FiCheckCircle size={14} /> Mark Fulfilled
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {filteredPledges.length > 0 && (
        <div className="member-pledges-count">
          Showing {filteredPledges.length} of {pledges.length} pledges
        </div>
      )}

      {showModal && canManagePledges && (
        <div className="member-pledges-modal-overlay" onClick={() => setShowModal(false)}>
          <div className="member-pledges-modal" onClick={(e) => e.stopPropagation()}>
            <div className="member-pledges-modal-header">
              <h3>{editingPledge ? "Edit Pledge" : "Create Pledge"}</h3>
              <button className="member-pledges-modal-close" onClick={() => setShowModal(false)}>
                <FiX size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="member-pledges-modal-form">
              <div className="member-pledges-form-row">
                <div className="member-pledges-form-group">
                  <label>Category Type</label>
                  <select
                    value={formData.categoryType}
                    onChange={(e) => setFormData({ ...formData, categoryType: e.target.value, categoryId: "" })}
                  >
                    <option value="giving">Giving</option>
                    <option value="expense">Expense</option>
                  </select>
                </div>
                <div className="member-pledges-form-group">
                  <label>Category</label>
                  <select
                    value={formData.categoryId}
                    onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                  >
                    <option value="">Select category</option>
                    {(formData.categoryType === "giving" ? givingCategories : expenseCategories)
                      .filter(c => c.isActive)
                      .map((c) => (
                        <option key={c.categoryId} value={c.categoryId}>
                          {c.name}
                        </option>
                      ))}
                  </select>
                </div>
              </div>

              <div className="member-pledges-form-row">
                <div className="member-pledges-form-group">
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
                <div className="member-pledges-form-group">
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

              <div className="member-pledges-form-row">
                <div className="member-pledges-form-group">
                  <label>Start Date *</label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    required
                  />
                </div>
                <div className="member-pledges-form-group">
                  <label>End Date *</label>
                  <input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="member-pledges-form-group">
                <label>Notes</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={2}
                  placeholder="Additional notes..."
                />
              </div>

              <div className="member-pledges-modal-actions">
                <button
                  type="button"
                  className="member-pledges-modal-cancel"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="member-pledges-modal-submit"
                  disabled={submitting}
                >
                  {submitting ? "Saving..." : editingPledge ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {selectedPledge && (
        <PayMyPledge
          isOpen={showPayModal}
          onClose={() => {
            setShowPayModal(false);
            setSelectedPledge(null);
          }}
          onSuccess={handleSuccess}
          pledge={selectedPledge}
        />
      )}
    </div>
  );
}