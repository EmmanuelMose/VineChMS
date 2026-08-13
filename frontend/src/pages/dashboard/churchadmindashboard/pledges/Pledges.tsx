// File: frontend/src/pages/dashboard/churchadmindashboard/pledges/Pledges.tsx

import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { fetchPledges, deletePledge, fulfillPledge, type Pledge } from "../../../../Features/pledges/pledgesAPI";
import { fetchMembers, type Member } from "../../../../Features/members/membersAPI";
import { fetchGivingCategories, type GivingCategory } from "../../../../Features/giving/givingAPI";
import { fetchExpenseCategories, type ExpenseCategory } from "../../../../Features/expenses/expensesAPI";
import { FiTrash2, FiCheckCircle, FiPlus, FiX, FiMaximize2, FiDollarSign } from "react-icons/fi";
import { hasPermission, type UserRole } from "../../../../utils/permissions";
import CreatePledge from "./CreatePledge";
import PayPledge from "./PayPledge";
import "./Pledges.css";

export default function Pledges() {
  const token = useSelector((state: any) => state.user.token);
  const churchId = useSelector((state: any) => state.user.user?.churchId);
  const userRole = useSelector((state: any) => state.user.user?.role) as UserRole;

  const [pledges, setPledges] = useState<Pledge[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [givingCategories, setGivingCategories] = useState<GivingCategory[]>([]);
  const [expenseCategories, setExpenseCategories] = useState<ExpenseCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showPayModal, setShowPayModal] = useState(false);
  const [selectedPledge, setSelectedPledge] = useState<Pledge | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filteredPledges, setFilteredPledges] = useState<Pledge[]>([]);
  const [profileImageModalOpen, setProfileImageModalOpen] = useState(false);
  const [profileImageUrl, setProfileImageUrl] = useState("");
  const [evidenceModalOpen, setEvidenceModalOpen] = useState(false);
  const [evidenceUrl] = useState("");

  const canManagePledges = hasPermission(userRole, "manage_pledges");

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    filterPledges();
  }, [pledges, searchTerm, filterStatus]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [pledgesData, membersData, givingData, expenseData] = await Promise.all([
        fetchPledges(token),
        fetchMembers(token),
        fetchGivingCategories(token),
        fetchExpenseCategories(token),
      ]);
      const churchPledges = pledgesData.filter((p) => p.churchId === churchId);
      const churchMembers = membersData.filter((m) => m.churchId === churchId);
      const churchGiving = givingData.filter((c) => c.churchId === churchId);
      const churchExpense = expenseData.filter((c) => c.churchId === churchId);
      setPledges(churchPledges);
      setMembers(churchMembers);
      setGivingCategories(churchGiving);
      setExpenseCategories(churchExpense);
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
    } else if (filterStatus === "partial") {
      filtered = filtered.filter((p) => !p.isFulfilled && parseFloat(p.amount) > parseFloat(p.paidAmount || "0"));
    }
    setFilteredPledges(filtered);
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

  const handlePayPledge = (pledge: Pledge) => {
    setSelectedPledge(pledge);
    setShowPayModal(true);
  };

  const handleSuccess = () => {
    setShowCreateModal(false);
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

  const getMemberName = (memberId: number) => {
    const member = members.find((m) => m.memberId === memberId);
    return member ? member.fullName : "Unknown";
  };

  const getMemberEmail = (memberId: number) => {
    const member = members.find((m) => m.memberId === memberId);
    return member ? member.email : "";
  };

  const getMemberProfilePicture = (memberId: number) => {
    const member = members.find((m) => m.memberId === memberId);
    return member?.profilePicture || null;
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

  const openProfileImageModal = (url: string) => {
    setProfileImageUrl(url);
    setProfileImageModalOpen(true);
  };

  if (loading) {
    return (
      <div className="pledges-loading">
        <div className="pledges-loading-spinner"></div>
        <p>Loading pledges...</p>
      </div>
    );
  }

  const totalAmount = pledges.reduce((sum, p) => sum + parseFloat(p.amount), 0);
  const totalPaid = pledges.reduce((sum, p) => sum + parseFloat(p.paidAmount || "0"), 0);

  return (
    <div className="pledges-page">
      {evidenceModalOpen && (
        <div className="pledges-modal-overlay" onClick={() => setEvidenceModalOpen(false)}>
          <div className="pledges-modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: "90vw", padding: "0.5rem" }}>
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

      {profileImageModalOpen && (
        <div className="pledges-modal-overlay" onClick={() => setProfileImageModalOpen(false)}>
          <div className="pledges-modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: "90vw", padding: "0.5rem" }}>
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
        <div className="pledges-modal-overlay" onClick={() => setShowDeleteModal(false)}>
          <div className="pledges-modal pledges-modal-small" onClick={(e) => e.stopPropagation()}>
            <div className="pledges-modal-header">
              <h3>Delete Pledge</h3>
              <button className="pledges-modal-close" onClick={() => setShowDeleteModal(false)}>
                Close
              </button>
            </div>
            <div className="pledges-modal-body">
              <p>Are you sure you want to permanently delete this pledge?</p>
              <p className="pledges-modal-warning">This action cannot be undone.</p>
            </div>
            <div className="pledges-modal-actions">
              <button className="pledges-modal-cancel" onClick={() => setShowDeleteModal(false)}>
                Cancel
              </button>
              <button className="pledges-modal-danger" onClick={handleDelete}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="pledges-header">
        <div>
          <h2 className="pledges-title">Pledges</h2>
          <p className="pledges-subtitle">Manage member pledges and track payments</p>
        </div>
        <div className="pledges-header-actions">
          {canManagePledges && (
            <button className="pledges-add-btn" onClick={() => setShowCreateModal(true)}>
              <FiPlus size={18} />
              Create Pledge
            </button>
          )}
        </div>
      </div>

      <div className="pledges-stats">
        <div className="pledges-stat">
          <span className="pledges-stat-value">{pledges.length}</span>
          <span className="pledges-stat-label">Total Pledges</span>
        </div>
        <div className="pledges-stat">
          <span className="pledges-stat-value">{formatCurrency(totalAmount.toString())}</span>
          <span className="pledges-stat-label">Total Pledged</span>
        </div>
        <div className="pledges-stat">
          <span className="pledges-stat-value">{formatCurrency(totalPaid.toString())}</span>
          <span className="pledges-stat-label">Total Paid</span>
        </div>
        <div className="pledges-stat">
          <span className="pledges-stat-value">{pledges.filter(p => p.isFulfilled).length}</span>
          <span className="pledges-stat-label">Fulfilled</span>
        </div>
        <div className="pledges-stat">
          <span className="pledges-stat-value">{pledges.filter(p => !p.isFulfilled).length}</span>
          <span className="pledges-stat-label">Pending</span>
        </div>
      </div>

      <div className="pledges-filters">
        <div className="pledges-filter-group">
          <label>Search</label>
          <input
            type="text"
            placeholder="Search by member or notes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="pledges-filter-group">
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

      <div className="pledges-cards-grid">
        {filteredPledges.length === 0 ? (
          <div className="pledges-empty">
            <p>No pledges found</p>
            <span>Try adjusting your filters</span>
          </div>
        ) : (
          filteredPledges.map((pledge) => {
            const profilePic = getMemberProfilePicture(pledge.memberId);
            const isFulfilled = pledge.isFulfilled;
            const progress = getProgress(pledge);
            const paidAmount = parseFloat(pledge.paidAmount || "0");
            const totalAmount = parseFloat(pledge.amount);
            const remaining = totalAmount - paidAmount;

            return (
              <div key={pledge.pledgeId} className="pledges-card">
                <div className="pledges-card-header">
                  <div className="pledges-card-member">
                    {profilePic ? (
                      <div
                        className="pledges-card-avatar pledges-avatar-clickable"
                        onClick={() => openProfileImageModal(profilePic!)}
                      >
                        <img src={profilePic} alt={getMemberName(pledge.memberId)} />
                        <div className="pledges-avatar-expand">
                          <FiMaximize2 size={12} />
                        </div>
                      </div>
                    ) : (
                      <div className="pledges-card-avatar">
                        {getMemberName(pledge.memberId).charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div className="pledges-card-member-info">
                      <span className="pledges-card-member-name">{getMemberName(pledge.memberId)}</span>
                      <span className="pledges-card-member-email">{getMemberEmail(pledge.memberId)}</span>
                    </div>
                  </div>
                  <div className="pledges-card-status-badge">
                    <span className={`pledges-status-badge ${isFulfilled ? "status-fulfilled" : "status-unfulfilled"}`}>
                      {isFulfilled ? "Fulfilled" : "Pending"}
                    </span>
                  </div>
                </div>

                <div className="pledges-card-body">
                  <div className="pledges-card-details">
                    <div className="pledges-card-detail">
                      <label>Category</label>
                      <span>{getCategoryName(pledge.categoryId, pledge.categoryType)}</span>
                    </div>
                    <div className="pledges-card-detail">
                      <label>Type</label>
                      <span className="pledges-category-type">{pledge.categoryType || "giving"}</span>
                    </div>
                    <div className="pledges-card-detail">
                      <label>Pledged Amount</label>
                      <span className="pledges-card-amount">{formatCurrency(pledge.amount)}</span>
                    </div>
                    <div className="pledges-card-detail">
                      <label>Paid Amount</label>
                      <span className="pledges-card-paid">{formatCurrency(pledge.paidAmount || "0")}</span>
                    </div>
                    <div className="pledges-card-detail">
                      <label>Remaining</label>
                      <span className="pledges-card-remaining">{formatCurrency(remaining.toString())}</span>
                    </div>
                    <div className="pledges-card-detail full-width">
                      <label>Progress</label>
                      <div className="pledges-progress-wrapper">
                        <div className="pledges-progress-bar">
                          <div 
                            className="pledges-progress-fill" 
                            style={{ width: `${progress}%` }}
                          ></div>
                        </div>
                        <span className="pledges-progress-text">{progress}%</span>
                      </div>
                    </div>
                    <div className="pledges-card-detail">
                      <label>Start Date</label>
                      <span>{formatDate(pledge.startDate)}</span>
                    </div>
                    <div className="pledges-card-detail">
                      <label>End Date</label>
                      <span>{formatDate(pledge.endDate)}</span>
                    </div>
                    <div className="pledges-card-detail">
                      <label>Frequency</label>
                      <span className="pledges-frequency">{pledge.frequency}</span>
                    </div>
                    {pledge.notes && (
                      <div className="pledges-card-detail full-width">
                        <label>Notes</label>
                        <span>{pledge.notes}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="pledges-card-footer">
                  {canManagePledges && (
                    <button 
                      className="pledges-card-btn pledges-card-btn-pay" 
                      onClick={() => handlePayPledge(pledge)}
                    >
                      <FiDollarSign size={14} /> Pay Pledge
                    </button>
                  )}
                  {canManagePledges && !isFulfilled && (
                    <button 
                      className="pledges-card-btn pledges-card-btn-fulfill" 
                      onClick={() => {
                        if (window.confirm("Mark this pledge as fulfilled?")) {
                          handleFulfill(pledge.pledgeId);
                        }
                      }}
                    >
                      <FiCheckCircle size={14} /> Mark Fulfilled
                    </button>
                  )}
                  {canManagePledges && (
                    <button
                      className="pledges-card-btn pledges-card-btn-delete"
                      onClick={() => {
                        setDeleteTargetId(pledge.pledgeId);
                        setShowDeleteModal(true);
                      }}
                    >
                      <FiTrash2 size={14} /> Delete
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      <CreatePledge
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={handleSuccess}
        churchId={churchId}
        members={members}
        givingCategories={givingCategories}
        expenseCategories={expenseCategories}
      />

      {selectedPledge && (
        <PayPledge
          isOpen={showPayModal}
          onClose={() => {
            setShowPayModal(false);
            setSelectedPledge(null);
          }}
          onSuccess={handleSuccess}
          pledge={selectedPledge}
          members={members}
        />
      )}
    </div>
  );
}