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
import { fetchMemberByUserId } from "../../../../Features/members/membersAPI";
import { FiPlus, FiEdit2, FiTrash2, FiCheckCircle, FiX } from "react-icons/fi";
import "./MyPledges.css";

export default function MyPledges() {
  const token = useSelector((state: any) => state.user.token);
  const churchId = useSelector((state: any) => state.user.user?.churchId);
  const userId = useSelector((state: any) => state.user.user?.userId);
  const userRole = useSelector((state: any) => state.user.user?.role);

  const [pledges, setPledges] = useState<Pledge[]>([]);
  const [categories, setCategories] = useState<GivingCategory[]>([]);
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
  const [showFulfillModal, setShowFulfillModal] = useState(false);
  const [fulfillTargetId, setFulfillTargetId] = useState<number | null>(null);

  const [formData, setFormData] = useState({
    categoryId: "",
    amount: "",
    startDate: new Date().toISOString().split("T")[0],
    endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split("T")[0],
    frequency: "monthly",
    notes: "",
  });

  const canManagePledges = userRole === "treasurer" || userRole === "church_admin" || userRole === "pastor" || userRole === "elder" || userRole === "secretary";
  const canFulfill = userRole === "treasurer" || userRole === "church_admin";

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
      const [pledgesData, categoriesData] = await Promise.all([
        fetchPledgesByMember(memberId, token),
        fetchGivingCategories(token),
      ]);
      const churchPledges = pledgesData.filter((p) => p.churchId === churchId);
      const churchCategories = categoriesData.filter((c) => c.churchId === churchId);
      setPledges(churchPledges);
      setCategories(churchCategories);
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
    }
    setFilteredPledges(filtered);
  };

  const handleCreate = () => {
    setEditingPledge(null);
    setFormData({
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

  const handleFulfill = async () => {
    if (!fulfillTargetId) return;
    try {
      await fulfillPledge(fulfillTargetId, token);
      setShowFulfillModal(false);
      setFulfillTargetId(null);
      await loadData();
    } catch (error) {
      console.error("Failed to fulfill pledge:", error);
      alert("Failed to fulfill pledge.");
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
      <div className="member-pledges-loading">
        <div className="member-pledges-loading-spinner"></div>
        <p>Loading pledges...</p>
      </div>
    );
  }

  const totalAmount = pledges.reduce((sum, p) => sum + parseFloat(p.amount), 0);
  const fulfilledAmount = pledges.filter(p => p.isFulfilled).reduce((sum, p) => sum + parseFloat(p.amount), 0);

  return (
    <div className="member-pledges-page">
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
          <span className="member-pledges-stat-label">Total Amount</span>
        </div>
        <div className="member-pledges-stat">
          <span className="member-pledges-stat-value">{pledges.filter(p => p.isFulfilled).length}</span>
          <span className="member-pledges-stat-label">Fulfilled</span>
        </div>
        <div className="member-pledges-stat">
          <span className="member-pledges-stat-value">{formatCurrency(fulfilledAmount.toString())}</span>
          <span className="member-pledges-stat-label">Fulfilled Amount</span>
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
          </select>
        </div>
      </div>

      <div className="member-pledges-table-wrapper">
        {filteredPledges.length > 0 ? (
          <table className="member-pledges-table">
            <thead>
              <tr>
                <th>Category</th>
                <th>Amount</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Frequency</th>
                <th>Status</th>
                <th>Notes</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPledges.map((pledge) => (
                <tr key={pledge.pledgeId}>
                  <td>{getCategoryName(pledge.categoryId)}</td>
                  <td className="member-pledges-amount">{formatCurrency(pledge.amount)}</td>
                  <td>{formatDate(pledge.startDate)}</td>
                  <td>{formatDate(pledge.endDate)}</td>
                  <td className="member-pledges-frequency">{pledge.frequency}</td>
                  <td>
                    <span className={`member-pledges-status ${pledge.isFulfilled ? "status-fulfilled" : "status-unfulfilled"}`}>
                      {pledge.isFulfilled ? "Fulfilled" : "Unfulfilled"}
                    </span>
                  </td>
                  <td>{pledge.notes || "—"}</td>
                  <td>
                    <div className="member-pledges-actions">
                      {canManagePledges && (
                        <>
                          <button className="member-pledges-action-edit" onClick={() => handleEdit(pledge)}>
                            <FiEdit2 size={14} /> Edit
                          </button>
                          <button
                            className="member-pledges-action-delete"
                            onClick={() => {
                              setDeleteTargetId(pledge.pledgeId);
                              setShowDeleteModal(true);
                            }}
                          >
                            <FiTrash2 size={14} /> Delete
                          </button>
                        </>
                      )}
                      {canFulfill && !pledge.isFulfilled && (
                        <button
                          className="member-pledges-action-fulfill"
                          onClick={() => {
                            setFulfillTargetId(pledge.pledgeId);
                            setShowFulfillModal(true);
                          }}
                        >
                          <FiCheckCircle size={14} /> Fulfill
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="member-pledges-empty">
            <p>No pledges found</p>
            {canManagePledges && <span>Create your first pledge</span>}
          </div>
        )}
      </div>

      {filteredPledges.length > 0 && (
        <div className="member-pledges-count">
          Showing {filteredPledges.length} of {pledges.length} pledges
        </div>
      )}

      {showModal && (
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
                <div className="member-pledges-form-group">
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

              <div className="member-pledges-form-row">
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

      {showFulfillModal && (
        <div className="member-pledges-modal-overlay" onClick={() => setShowFulfillModal(false)}>
          <div className="member-pledges-modal member-pledges-modal-small" onClick={(e) => e.stopPropagation()}>
            <div className="member-pledges-modal-header">
              <h3>Fulfill Pledge</h3>
              <button className="member-pledges-modal-close" onClick={() => setShowFulfillModal(false)}>
                <FiX size={20} />
              </button>
            </div>
            <div className="member-pledges-modal-body">
              <p>Are you sure you want to mark this pledge as fulfilled?</p>
              <p className="member-pledges-modal-info">This will update the pledge status to fulfilled.</p>
            </div>
            <div className="member-pledges-modal-actions">
              <button className="member-pledges-modal-cancel" onClick={() => setShowFulfillModal(false)}>
                Cancel
              </button>
              <button className="member-pledges-modal-fulfill" onClick={handleFulfill}>
                Fulfill
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}