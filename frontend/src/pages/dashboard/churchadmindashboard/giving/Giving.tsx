// File: src/pages/dashboard/churchadmindashboard/giving/Giving.tsx

import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  FiSearch,
  FiX,
  FiCheck,
  FiXCircle,
  FiSend,
  FiDollarSign,
  FiEye,
  FiMaximize2,
  FiFilter,
} from "react-icons/fi";
import {
  fetchGiving,
  deleteGiving,
  approveGiving,
  rejectGiving,
  type Giving,
} from "../../../../Features/giving/givingAPI";
import { fetchGivingCategories, type GivingCategory } from "../../../../Features/giving/givingAPI";
import { fetchMembers, type Member } from "../../../../Features/members/membersAPI";
import CreateGiving from "./CreateGiving";
import GivingCategories from "./GivingCategories";
import "./Giving.css";

export default function Giving() {
  const token = useSelector((state: any) => state.user.token);
  const churchId = useSelector((state: any) => state.user.user?.churchId);
  const userRole = useSelector((state: any) => state.user.user?.role);

  const [giving, setGiving] = useState<Giving[]>([]);
  const [categories, setCategories] = useState<GivingCategory[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"mpesa" | "cash">("mpesa");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [approveTargetId, setApproveTargetId] = useState<number | null>(null);
  const [approveAmount, setApproveAmount] = useState("");
  const [approveEvidenceUrl, setApproveEvidenceUrl] = useState("");
  const [approveMemberName, setApproveMemberName] = useState("");
  const [approveCategory, setApproveCategory] = useState("");
  const [approveDate, setApproveDate] = useState("");
  const [approveNotes, setApproveNotes] = useState("");
  const [approveReceiptNumber, setApproveReceiptNumber] = useState("");
  const [approvePaymentMethod, setApprovePaymentMethod] = useState("");
  const [approveMemberProfilePic, setApproveMemberProfilePic] = useState("");
  const [evidenceModalOpen, setEvidenceModalOpen] = useState(false);
  const [evidenceUrl, setEvidenceUrl] = useState("");
  const [profileImageModalOpen, setProfileImageModalOpen] = useState(false);
  const [profileImageUrl, setProfileImageUrl] = useState("");
  const [showCategories, setShowCategories] = useState(false);
  const [approving, setApproving] = useState(false);
  const [rejectingId, setRejectingId] = useState<number | null>(null);

  const canApprove = userRole === "treasurer" || userRole === "church_admin" || userRole === "pastor" || userRole === "elder";

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [givingData, categoriesData, membersData] = await Promise.all([
        fetchGiving(token),
        fetchGivingCategories(token),
        fetchMembers(token),
      ]);
      const filteredGiving = givingData.filter((g) => g.churchId === churchId);
      const filteredCategories = categoriesData.filter((c) => c.churchId === churchId);
      setGiving(filteredGiving);
      setCategories(filteredCategories);
      setMembers(membersData);
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
        await deleteGiving(deleteTargetId, token);
        await loadData();
        setShowDeleteModal(false);
        setDeleteTargetId(null);
      } catch (error) {
        console.error("Failed to delete giving:", error);
      }
    }
  };

  const openApproveModal = (record: Giving) => {
    const member = members.find((m) => m.memberId === record.memberId);
    setApproveTargetId(record.givingId);
    setApproveAmount(record.amount);
    setApproveEvidenceUrl(record.receiptFile || "");
    setApproveMemberName(member ? member.fullName : "Unknown");
    setApproveCategory(getCategoryName(record.categoryId));
    setApproveDate(new Date(record.date).toLocaleDateString());
    setApproveNotes(record.notes || "");
    setApproveReceiptNumber(record.receiptNumber || "");
    setApprovePaymentMethod(record.paymentMethod || "cash");
    setApproveMemberProfilePic(member?.profilePicture || "");
    setShowApproveModal(true);
  };

  const handleApprove = async () => {
    if (!approveTargetId) return;
    setApproving(true);
    try {
      const amount = parseFloat(approveAmount);
      await approveGiving(approveTargetId, token, amount);
      setShowApproveModal(false);
      setApproveTargetId(null);
      await loadData();
    } catch (error: any) {
      console.error("Failed to approve giving:", error);
      alert(error.response?.data?.message || "Failed to approve giving. Please try again.");
    } finally {
      setApproving(false);
    }
  };

  const handleReject = async (id: number) => {
    if (!window.confirm("Are you sure you want to reject this giving record?")) return;
    setRejectingId(id);
    try {
      await rejectGiving(id, token);
      await loadData();
    } catch (error) {
      console.error("Failed to reject giving:", error);
      alert("Failed to reject giving. Please try again.");
    } finally {
      setRejectingId(null);
    }
  };

  const handleSuccess = () => {
    loadData();
    setCreateModalOpen(false);
  };

  const getMember = (memberId: number) => {
    return members.find((m) => m.memberId === memberId);
  };

  const getMemberName = (memberId: number) => {
    const member = getMember(memberId);
    return member ? member.fullName : "Unknown";
  };

  const getMemberEmail = (memberId: number) => {
    const member = getMember(memberId);
    return member ? member.email : "";
  };

  const getMemberProfilePicture = (memberId: number) => {
    const member = getMember(memberId);
    return member?.profilePicture || null;
  };

  const getCategoryName = (categoryId?: number) => {
    if (!categoryId) return "Uncategorized";
    const cat = categories.find((c) => c.categoryId === categoryId);
    return cat ? cat.name : "Unknown";
  };

  const formatCurrency = (amount: string) => {
    const num = parseFloat(amount);
    if (isNaN(num)) return "KES 0.00";
    return `KES ${num.toFixed(2)}`;
  };

  const openMpesaModal = () => {
    setModalMode("mpesa");
    setCreateModalOpen(true);
  };

  const openCashModal = () => {
    setModalMode("cash");
    setCreateModalOpen(true);
  };

  const openEvidenceModal = (url: string) => {
    setEvidenceUrl(url);
    setEvidenceModalOpen(true);
  };

  const openProfileImageModal = (url: string) => {
    setProfileImageUrl(url);
    setProfileImageModalOpen(true);
  };

  const filteredGiving = giving.filter((record) => {
    const memberName = getMemberName(record.memberId).toLowerCase();
    const memberEmail = getMemberEmail(record.memberId).toLowerCase();
    const categoryName = getCategoryName(record.categoryId).toLowerCase();
    const searchLower = searchTerm.toLowerCase();

    const matchesSearch =
      memberName.includes(searchLower) ||
      memberEmail.includes(searchLower) ||
      categoryName.includes(searchLower) ||
      (record.notes || "").toLowerCase().includes(searchLower) ||
      (record.receiptNumber || "").toLowerCase().includes(searchLower);

    const matchesCategory = filterCategory === "all" || record.categoryId === parseInt(filterCategory);
    const matchesStatus = filterStatus === "all" || record.status === filterStatus;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  if (loading) {
    return (
      <div className="giving-loading">
        <div className="giving-loading-spinner"></div>
        <p>Loading giving records...</p>
      </div>
    );
  }

  if (showCategories) {
    return (
      <GivingCategories
        onBack={() => setShowCategories(false)}
        token={token}
        churchId={churchId!}
      />
    );
  }

  return (
    <div className="giving-page">
      {showDeleteModal && (
        <div className="giving-modal-overlay" onClick={() => setShowDeleteModal(false)}>
          <div className="giving-modal giving-modal-confirm" onClick={(e) => e.stopPropagation()}>
            <div className="giving-modal-header">
              <h3>Delete Giving Record</h3>
              <button onClick={() => setShowDeleteModal(false)} className="giving-modal-close">
                <FiX size={20} />
              </button>
            </div>
            <div className="giving-modal-body">
              <p>Are you sure you want to permanently delete this giving record?</p>
              <p className="giving-modal-warning">This action cannot be undone.</p>
            </div>
            <div className="giving-modal-actions">
              <button onClick={() => setShowDeleteModal(false)} className="giving-btn-cancel">
                Cancel
              </button>
              <button onClick={confirmDelete} className="giving-btn-danger">
                Delete Permanently
              </button>
            </div>
          </div>
        </div>
      )}

      {showApproveModal && (
        <div className="giving-modal-overlay" onClick={() => setShowApproveModal(false)}>
          <div className="giving-approve-modal" onClick={(e) => e.stopPropagation()}>
            <div className="giving-approve-modal-header">
              <h3>Review & Approve Giving</h3>
              <button
                className="giving-approve-modal-close"
                onClick={() => setShowApproveModal(false)}
              >
                <FiX size={24} />
              </button>
            </div>
            <div className="giving-approve-modal-body">
              <div className="giving-approve-member">
                {approveMemberProfilePic ? (
                  <div
                    className="giving-approve-avatar giving-avatar-clickable"
                    onClick={() => openProfileImageModal(approveMemberProfilePic)}
                  >
                    <img src={approveMemberProfilePic} alt={approveMemberName} />
                    <div className="giving-avatar-expand">
                      <FiMaximize2 size={12} />
                    </div>
                  </div>
                ) : (
                  <div className="giving-approve-avatar">
                    {approveMemberName.charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="giving-approve-member-info">
                  <strong>{approveMemberName}</strong>
                  <span>Member</span>
                </div>
              </div>

              <div className="giving-approve-details-grid">
                <div className="giving-approve-detail-item">
                  <label>Category</label>
                  <span>{approveCategory}</span>
                </div>
                <div className="giving-approve-detail-item">
                  <label>Date</label>
                  <span>{approveDate}</span>
                </div>
                <div className="giving-approve-detail-item">
                  <label>Payment Method</label>
                  <span>{approvePaymentMethod}</span>
                </div>
                <div className="giving-approve-detail-item">
                  <label>Receipt Number</label>
                  <span>{approveReceiptNumber || "—"}</span>
                </div>
                {approveNotes && (
                  <div className="giving-approve-detail-item full-width">
                    <label>Notes</label>
                    <span>{approveNotes}</span>
                  </div>
                )}
                {approveEvidenceUrl && (
                  <div className="giving-approve-detail-item full-width">
                    <label>Evidence</label>
                    <div className="giving-approve-evidence">
                      <img
                        src={approveEvidenceUrl}
                        alt="Evidence"
                        className="giving-approve-evidence-image"
                        onClick={() => openEvidenceModal(approveEvidenceUrl)}
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="giving-approve-amount-section">
                <label>Amount (KES)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  value={approveAmount}
                  onChange={(e) => setApproveAmount(e.target.value)}
                  className="giving-approve-amount-input"
                />
                <small className="giving-approve-hint">
                  Adjust the amount if it differs from the evidence.
                </small>
              </div>
            </div>
            <div className="giving-approve-modal-actions">
              <button
                className="giving-btn-cancel"
                onClick={() => setShowApproveModal(false)}
              >
                Cancel
              </button>
              <button
                className="giving-btn-reject"
                onClick={async () => {
                  if (approveTargetId) {
                    await handleReject(approveTargetId);
                    setShowApproveModal(false);
                    setApproveTargetId(null);
                  }
                }}
                disabled={rejectingId === approveTargetId}
              >
                {rejectingId === approveTargetId ? "Rejecting..." : "Reject"}
              </button>
              <button
                className="giving-btn-approve"
                onClick={handleApprove}
                disabled={approving || !approveAmount || parseFloat(approveAmount) <= 0}
              >
                {approving ? "Approving..." : "Approve"}
              </button>
            </div>
          </div>
        </div>
      )}

      {evidenceModalOpen && (
        <div className="giving-modal-overlay" onClick={() => setEvidenceModalOpen(false)}>
          <div className="giving-evidence-modal" onClick={(e) => e.stopPropagation()}>
            <button
              className="giving-evidence-modal-close"
              onClick={() => setEvidenceModalOpen(false)}
            >
              <FiX size={24} />
            </button>
            <img src={evidenceUrl} alt="Evidence" className="giving-evidence-image" />
          </div>
        </div>
      )}

      {profileImageModalOpen && (
        <div className="giving-modal-overlay" onClick={() => setProfileImageModalOpen(false)}>
          <div className="giving-evidence-modal" onClick={(e) => e.stopPropagation()}>
            <button
              className="giving-evidence-modal-close"
              onClick={() => setProfileImageModalOpen(false)}
            >
              <FiX size={24} />
            </button>
            <img src={profileImageUrl} alt="Profile" className="giving-evidence-image" />
          </div>
        </div>
      )}

      <div className="giving-header">
        <div>
          <h2 className="giving-title">Giving Management</h2>
          <p className="giving-subtitle">Manage all giving records, approve pending, or send STK push</p>
        </div>
        <div className="giving-header-actions">
          <button onClick={() => setShowCategories(true)} className="giving-btn-categories">
            <FiFilter size={16} />
            Categories
          </button>
          <button onClick={openMpesaModal} className="giving-btn-primary">
            <FiSend size={16} />
            Send M-Pesa
          </button>
          <button onClick={openCashModal} className="giving-btn-secondary">
            <FiDollarSign size={16} />
            Record Cash
          </button>
        </div>
      </div>

      <div className="giving-toolbar">
        <div className="giving-search">
          <FiSearch className="giving-search-icon" />
          <input
            type="text"
            placeholder="Search by member, email, category, or notes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="giving-search-input"
          />
          {searchTerm && (
            <button onClick={() => setSearchTerm("")} className="giving-search-clear">
              <FiX size={16} />
            </button>
          )}
        </div>
        <div className="giving-filters">
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="giving-filter-select"
          >
            <option value="all">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.categoryId} value={cat.categoryId}>
                {cat.name}
              </option>
            ))}
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="giving-filter-select"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
            <option value="failed">Failed</option>
            <option value="refunded">Refunded</option>
          </select>
        </div>
      </div>

      {/* Card Grid Layout */}
      <div className="giving-cards-grid">
        {filteredGiving.length === 0 ? (
          <div className="giving-empty-state">
            <p>No giving records found</p>
            <span>Try adjusting your filters</span>
          </div>
        ) : (
          filteredGiving.map((record) => {
            const profilePic = getMemberProfilePicture(record.memberId);
            const hasEvidence = record.receiptFile && record.paymentMethod !== "mpesa";
            const isPending = record.status === "pending";
            const isMpesaPending = isPending && record.paymentMethod === "mpesa";

            return (
              <div key={record.givingId} className="giving-card">
                <div className="giving-card-header">
                  <div className="giving-card-member">
                    {profilePic ? (
                      <div
                        className="giving-card-avatar giving-avatar-clickable"
                        onClick={() => openProfileImageModal(profilePic!)}
                      >
                        <img src={profilePic} alt={getMemberName(record.memberId)} />
                        <div className="giving-avatar-expand">
                          <FiMaximize2 size={12} />
                        </div>
                      </div>
                    ) : (
                      <div className="giving-card-avatar">
                        {getMemberName(record.memberId).charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div className="giving-card-member-info">
                      <span className="giving-card-member-name">{getMemberName(record.memberId)}</span>
                      <span className="giving-card-member-email">{getMemberEmail(record.memberId)}</span>
                    </div>
                  </div>
                  <div className="giving-card-status-badge">
                    <span className={`giving-status-badge status-${record.status}`}>
                      {record.status}
                    </span>
                  </div>
                </div>

                <div className="giving-card-body">
                  <div className="giving-card-details">
                    <div className="giving-card-detail">
                      <label>Category</label>
                      <span>{getCategoryName(record.categoryId)}</span>
                    </div>
                    <div className="giving-card-detail">
                      <label>Amount</label>
                      <span className="giving-card-amount">{formatCurrency(record.amount)}</span>
                    </div>
                    <div className="giving-card-detail">
                      <label>Date</label>
                      <span>{new Date(record.date).toLocaleDateString()}</span>
                    </div>
                    <div className="giving-card-detail">
                      <label>Method</label>
                      <span className="giving-method-badge">{record.paymentMethod || "cash"}</span>
                    </div>
                    {hasEvidence && (
                      <div className="giving-card-detail full-width">
                        <label>Evidence</label>
                        <button
                          className="giving-evidence-btn"
                          onClick={() => openEvidenceModal(record.receiptFile!)}
                        >
                          <FiEye size={16} />
                          <span>View Evidence</span>
                        </button>
                      </div>
                    )}
                    {record.notes && (
                      <div className="giving-card-detail full-width">
                        <label>Notes</label>
                        <span>{record.notes}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="giving-card-footer">
                  {canApprove && isPending && !isMpesaPending && (
                    <>
                      <button
                        onClick={() => openApproveModal(record)}
                        className="giving-card-btn giving-card-btn-approve"
                      >
                        <FiCheck size={16} />
                        Approve
                      </button>
                      <button
                        onClick={() => handleReject(record.givingId)}
                        className="giving-card-btn giving-card-btn-reject"
                        disabled={rejectingId === record.givingId}
                      >
                        {rejectingId === record.givingId ? "..." : <FiXCircle size={16} />}
                        Reject
                      </button>
                    </>
                  )}
                  {isMpesaPending && (
                    <span className="giving-mpesa-waiting">⏳ Waiting for M-Pesa confirmation...</span>
                  )}
                  <button
                    onClick={() => handleDeleteClick(record.givingId)}
                    className="giving-card-btn giving-card-btn-delete"
                  >
                    <FiX size={16} />
                    Delete
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      <CreateGiving
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSuccess={handleSuccess}
        churchId={churchId}
        members={members}
        categories={categories}
        mode={modalMode}
      />
    </div>
  );
}