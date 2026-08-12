import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { fetchPledges, createPledge, updatePledge, deletePledge, fulfillPledge, type Pledge } from "../../../../Features/pledges/pledgesAPI";
import { fetchMembers, type Member } from "../../../../Features/members/membersAPI";
import { fetchGivingCategories, type GivingCategory } from "../../../../Features/giving/givingAPI";
import { FiPlus, FiEdit2, FiTrash2, FiCheckCircle } from "react-icons/fi";
import "./Pledges.css";

export default function Pledges() {
  const token = useSelector((state: any) => state.user.token);
  const churchId = useSelector((state: any) => state.user.user?.churchId);

  const [pledges, setPledges] = useState<Pledge[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [categories, setCategories] = useState<GivingCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingPledge, setEditingPledge] = useState<Pledge | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filteredPledges, setFilteredPledges] = useState<Pledge[]>([]);

  const [formData, setFormData] = useState({
    memberId: "",
    categoryId: "",
    amount: "",
    startDate: new Date().toISOString().split("T")[0],
    endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split("T")[0],
    frequency: "monthly",
    notes: "",
  });

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    filterPledges();
  }, [pledges, searchTerm, filterStatus]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [pledgesData, membersData, categoriesData] = await Promise.all([
        fetchPledges(token),
        fetchMembers(token),
        fetchGivingCategories(token),
      ]);
      const churchPledges = pledgesData.filter((p) => p.churchId === churchId);
      const churchMembers = membersData.filter((m) => m.churchId === churchId);
      const churchCategories = categoriesData.filter((c) => c.churchId === churchId);
      setPledges(churchPledges);
      setMembers(churchMembers);
      setCategories(churchCategories);
    } catch (error) {
      console.error("Failed to load data:", error);
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
          (p.fullName || "").toLowerCase().includes(term) ||
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
      memberId: "",
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
      memberId: pledge.memberId.toString(),
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
    setSubmitting(true);
    try {
      const payload = {
        memberId: parseInt(formData.memberId),
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

  const handleFulfill = async (id: number) => {
    try {
      await fulfillPledge(id, token);
      await loadData();
      alert("Pledge marked as fulfilled!");
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

  const getMemberName = (memberId: number) => {
    const member = members.find((m) => m.memberId === memberId);
    return member ? member.fullName : "Unknown";
  };

  const getCategoryName = (categoryId?: number) => {
    if (!categoryId) return "Uncategorized";
    const cat = categories.find((c) => c.categoryId === categoryId);
    return cat ? cat.name : "Unknown";
  };

  if (loading) {
    return (
      <div className="admin-pledges-loading">
        <div className="admin-pledges-loading-spinner"></div>
        <p>Loading pledges...</p>
      </div>
    );
  }

  const totalAmount = pledges.reduce((sum, p) => sum + parseFloat(p.amount), 0);
  const fulfilledAmount = pledges.filter(p => p.isFulfilled).reduce((sum, p) => sum + parseFloat(p.amount), 0);

  return (
    <div className="admin-pledges-page">
      <div className="admin-pledges-header">
        <div>
          <h2 className="admin-pledges-title">Pledges</h2>
          <p className="admin-pledges-subtitle">Manage member pledges and commitments</p>
        </div>
        <button className="admin-pledges-add-btn" onClick={handleCreate}>
          <FiPlus size={18} />
          Create Pledge
        </button>
      </div>

      <div className="admin-pledges-stats">
        <div className="admin-pledges-stat">
          <span className="admin-pledges-stat-value">{pledges.length}</span>
          <span className="admin-pledges-stat-label">Total Pledges</span>
        </div>
        <div className="admin-pledges-stat">
          <span className="admin-pledges-stat-value">{formatCurrency(totalAmount.toString())}</span>
          <span className="admin-pledges-stat-label">Total Amount</span>
        </div>
        <div className="admin-pledges-stat">
          <span className="admin-pledges-stat-value">{pledges.filter(p => p.isFulfilled).length}</span>
          <span className="admin-pledges-stat-label">Fulfilled</span>
        </div>
        <div className="admin-pledges-stat">
          <span className="admin-pledges-stat-value">{pledges.filter(p => !p.isFulfilled).length}</span>
          <span className="admin-pledges-stat-label">Unfulfilled</span>
        </div>
        <div className="admin-pledges-stat">
          <span className="admin-pledges-stat-value">{formatCurrency(fulfilledAmount.toString())}</span>
          <span className="admin-pledges-stat-label">Fulfilled Amount</span>
        </div>
      </div>

      <div className="admin-pledges-filters">
        <div className="admin-pledges-filter-group">
          <label>Search</label>
          <input
            type="text"
            placeholder="Search by member or notes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="admin-pledges-filter-group">
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

      <div className="admin-pledges-table-wrapper">
        {filteredPledges.length > 0 ? (
          <table className="admin-pledges-table">
            <thead>
              <tr>
                <th>Member</th>
                <th>Category</th>
                <th>Amount</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Frequency</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPledges.map((pledge) => (
                <tr key={pledge.pledgeId}>
                  <td>{getMemberName(pledge.memberId)}</td>
                  <td>{getCategoryName(pledge.categoryId)}</td>
                  <td className="admin-pledges-amount">{formatCurrency(pledge.amount)}</td>
                  <td>{formatDate(pledge.startDate)}</td>
                  <td>{formatDate(pledge.endDate)}</td>
                  <td className="admin-pledges-frequency">{pledge.frequency}</td>
                  <td>
                    <span className={`admin-pledges-status ${pledge.isFulfilled ? "status-fulfilled" : "status-unfulfilled"}`}>
                      {pledge.isFulfilled ? "Fulfilled" : "Unfulfilled"}
                    </span>
                  </td>
                  <td>
                    <div className="admin-pledges-actions">
                      <button className="admin-pledges-action-edit" onClick={() => handleEdit(pledge)}>
                        <FiEdit2 size={14} /> Edit
                      </button>
                      {!pledge.isFulfilled && (
                        <button className="admin-pledges-action-fulfill" onClick={() => handleFulfill(pledge.pledgeId)}>
                          <FiCheckCircle size={14} /> Fulfill
                        </button>
                      )}
                      <button
                        className="admin-pledges-action-delete"
                        onClick={() => {
                          setDeleteTargetId(pledge.pledgeId);
                          setShowDeleteModal(true);
                        }}
                      >
                        <FiTrash2 size={14} /> Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="admin-pledges-empty">
            <p>No pledges found</p>
          </div>
        )}
      </div>

      {showModal && (
        <div className="admin-pledges-modal-overlay" onClick={() => setShowModal(false)}>
          <div className="admin-pledges-modal" onClick={(e) => e.stopPropagation()}>
            <div className="admin-pledges-modal-header">
              <h3>{editingPledge ? "Edit Pledge" : "Create Pledge"}</h3>
              <button className="admin-pledges-modal-close" onClick={() => setShowModal(false)}>
                Close
              </button>
            </div>
            <form onSubmit={handleSubmit} className="admin-pledges-modal-form">
              <div className="admin-pledges-form-row">
                <div className="admin-pledges-form-group">
                  <label>Member *</label>
                  <select
                    value={formData.memberId}
                    onChange={(e) => setFormData({ ...formData, memberId: e.target.value })}
                    required
                  >
                    <option value="">Select member</option>
                    {members.map((m) => (
                      <option key={m.memberId} value={m.memberId}>
                        {m.fullName} ({m.email})
                      </option>
                    ))}
                  </select>
                </div>
                <div className="admin-pledges-form-group">
                  <label>Category</label>
                  <select
                    value={formData.categoryId}
                    onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                  >
                    <option value="">Select category</option>
                    {categories.map((c) => (
                      <option key={c.categoryId} value={c.categoryId}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="admin-pledges-form-row">
                <div className="admin-pledges-form-group">
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
                <div className="admin-pledges-form-group">
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
              <div className="admin-pledges-form-row">
                <div className="admin-pledges-form-group">
                  <label>Start Date *</label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    required
                  />
                </div>
                <div className="admin-pledges-form-group">
                  <label>End Date *</label>
                  <input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="admin-pledges-form-group">
                <label>Notes</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={2}
                  placeholder="Additional notes..."
                />
              </div>
              <div className="admin-pledges-modal-actions">
                <button type="button" className="admin-pledges-modal-cancel" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="admin-pledges-modal-submit" disabled={submitting}>
                  {submitting ? "Saving..." : editingPledge ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showDeleteModal && (
        <div className="admin-pledges-modal-overlay" onClick={() => setShowDeleteModal(false)}>
          <div className="admin-pledges-modal admin-pledges-modal-small" onClick={(e) => e.stopPropagation()}>
            <div className="admin-pledges-modal-header">
              <h3>Delete Pledge</h3>
              <button className="admin-pledges-modal-close" onClick={() => setShowDeleteModal(false)}>
                Close
              </button>
            </div>
            <div className="admin-pledges-modal-body">
              <p>Are you sure you want to delete this pledge?</p>
              <p className="admin-pledges-modal-warning">This action cannot be undone.</p>
            </div>
            <div className="admin-pledges-modal-actions">
              <button className="admin-pledges-modal-cancel" onClick={() => setShowDeleteModal(false)}>
                Cancel
              </button>
              <button className="admin-pledges-modal-danger" onClick={handleDelete}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}