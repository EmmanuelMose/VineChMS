// File: src/pages/dashboard/churchmemberdashboard/giving/MyGiving.tsx

import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  FiSearch,
  FiX,
  FiCheck,
  FiXCircle,
  FiEye,
  FiMaximize2,
  FiFilter,
  FiSend,
  FiDollarSign,
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
import CreateMyGiving from "./CreateMyGiving";
import UpdateMyGiving from "./UpdateMyGiving";
import MyGivingCategories from "./MyGivingCategories";
import { hasPermission, type UserRole } from "../../../../utils/permissions";
import "./MyGiving.css";

export default function MyGiving() {
  const token = useSelector((state: any) => state.user.token);
  const churchId = useSelector((state: any) => state.user.user?.churchId);
  const userRole = useSelector((state: any) => state.user.user?.role) as UserRole;
  const currentUserId = useSelector((state: any) => state.user.user?.userId);

  const [giving, setGiving] = useState<Giving[]>([]);
  const [categories, setCategories] = useState<GivingCategory[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [currentMemberId, setCurrentMemberId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [modalMode, setModalMode] = useState<"mpesa" | "cash">("mpesa");
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [editingRecord, setEditingRecord] = useState<Giving | null>(null);
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

  const canViewAllGiving = hasPermission(userRole, "view_all_giving");
  const canViewOwnGiving = hasPermission(userRole, "view_own_giving");
  const canManageGiving = hasPermission(userRole, "manage_giving");
  const canApprove = hasPermission(userRole, "approve_giving");
  const canUseMpesa = hasPermission(userRole, "create_giving_mpesa");
  const canUseCash = hasPermission(userRole, "create_giving_cash");
  const canCreateForOthers = hasPermission(userRole, "create_giving_for_others");
  const canManageCategories = hasPermission(userRole, "manage_giving_categories");
  const canCreateOwn = hasPermission(userRole, "create_own_giving");

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

  const handleEdit = (record: Giving) => {
    setEditingRecord(record);
    setShowUpdateModal(true);
  };

  const handleSuccess = () => {
    loadData();
    setShowCreateModal(false);
    setShowUpdateModal(false);
    setEditingRecord(null);
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

  const openEvidenceModal = (url: string) => {
    setEvidenceUrl(url);
    setEvidenceModalOpen(true);
  };

  const openProfileImageModal = (url: string) => {
    setProfileImageUrl(url);
    setProfileImageModalOpen(true);
  };

  const filteredGiving = giving.filter((record) => {
    if (!canViewOwnGiving) return false;
    if (!canViewAllGiving && record.memberId !== currentMemberId) return false;

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
      <div className="member-giving-loading">
        <div className="member-giving-loading-spinner"></div>
        <p>Loading giving records...</p>
      </div>
    );
  }

  if (showCategories) {
    return (
      <MyGivingCategories
        onBack={() => setShowCategories(false)}
        token={token}
        churchId={churchId!}
        userRole={userRole}
      />
    );
  }

  return (
    <div className="member-giving-page">
      {showDeleteModal && (
        <div className="member-giving-modal-overlay" onClick={() => setShowDeleteModal(false)}>
          <div className="member-giving-modal member-giving-modal-small" onClick={(e) => e.stopPropagation()}>
            <div className="member-giving-modal-header">
              <h3>Delete Record</h3>
              <button className="member-giving-modal-close" onClick={() => setShowDeleteModal(false)}>
                Close
              </button>
            </div>
            <div className="member-giving-modal-body">
              <p>Are you sure you want to permanently delete this giving record?</p>
              <p className="member-giving-modal-warning">This action cannot be undone.</p>
            </div>
            <div className="member-giving-modal-actions">
              <button className="member-giving-modal-cancel" onClick={() => setShowDeleteModal(false)}>
                Cancel
              </button>
              <button className="member-giving-modal-danger" onClick={confirmDelete}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {showApproveModal && (
        <div className="member-giving-modal-overlay" onClick={() => setShowApproveModal(false)}>
          <div className="member-giving-approve-modal" onClick={(e) => e.stopPropagation()}>
            <div className="member-giving-approve-modal-header">
              <h3>Review & Approve Giving</h3>
              <button
                className="member-giving-approve-modal-close"
                onClick={() => setShowApproveModal(false)}
              >
                <FiX size={24} />
              </button>
            </div>
            <div className="member-giving-approve-modal-body">
              <div className="member-giving-approve-member">
                {approveMemberProfilePic ? (
                  <div
                    className="member-giving-approve-avatar member-giving-avatar-clickable"
                    onClick={() => openProfileImageModal(approveMemberProfilePic)}
                  >
                    <img src={approveMemberProfilePic} alt={approveMemberName} />
                    <div className="member-giving-avatar-expand">
                      <FiMaximize2 size={12} />
                    </div>
                  </div>
                ) : (
                  <div className="member-giving-approve-avatar">
                    {approveMemberName.charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="member-giving-approve-member-info">
                  <strong>{approveMemberName}</strong>
                  <span>Member</span>
                </div>
              </div>

              <div className="member-giving-approve-details-grid">
                <div className="member-giving-approve-detail-item">
                  <label>Category</label>
                  <span>{approveCategory}</span>
                </div>
                <div className="member-giving-approve-detail-item">
                  <label>Date</label>
                  <span>{approveDate}</span>
                </div>
                <div className="member-giving-approve-detail-item">
                  <label>Payment Method</label>
                  <span>{approvePaymentMethod}</span>
                </div>
                <div className="member-giving-approve-detail-item">
                  <label>Receipt Number</label>
                  <span>{approveReceiptNumber || "—"}</span>
                </div>
                {approveNotes && (
                  <div className="member-giving-approve-detail-item full-width">
                    <label>Notes</label>
                    <span>{approveNotes}</span>
                  </div>
                )}
                {approveEvidenceUrl && (
                  <div className="member-giving-approve-detail-item full-width">
                    <label>Evidence</label>
                    <div className="member-giving-approve-evidence">
                      <img
                        src={approveEvidenceUrl}
                        alt="Evidence"
                        className="member-giving-approve-evidence-image"
                        onClick={() => openEvidenceModal(approveEvidenceUrl)}
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="member-giving-approve-amount-section">
                <label>Amount (KES)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  value={approveAmount}
                  onChange={(e) => setApproveAmount(e.target.value)}
                  className="member-giving-approve-amount-input"
                />
                <small className="member-giving-approve-hint">
                  Adjust the amount if it differs from the evidence.
                </small>
              </div>
            </div>
            <div className="member-giving-approve-modal-actions">
              <button
                className="member-giving-btn-cancel"
                onClick={() => setShowApproveModal(false)}
              >
                Cancel
              </button>
              <button
                className="member-giving-btn-reject"
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
                className="member-giving-btn-approve"
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
        <div className="member-giving-modal-overlay" onClick={() => setEvidenceModalOpen(false)}>
          <div className="member-giving-evidence-modal" onClick={(e) => e.stopPropagation()}>
            <button
              className="member-giving-evidence-modal-close"
              onClick={() => setEvidenceModalOpen(false)}
            >
              <FiX size={24} />
            </button>
            <img src={evidenceUrl} alt="Evidence" className="member-giving-evidence-image" />
          </div>
        </div>
      )}

      {profileImageModalOpen && (
        <div className="member-giving-modal-overlay" onClick={() => setProfileImageModalOpen(false)}>
          <div className="member-giving-evidence-modal" onClick={(e) => e.stopPropagation()}>
            <button
              className="member-giving-evidence-modal-close"
              onClick={() => setProfileImageModalOpen(false)}
            >
              <FiX size={24} />
            </button>
            <img src={profileImageUrl} alt="Profile" className="member-giving-evidence-image" />
          </div>
        </div>
      )}

      <div className="member-giving-header">
        <div>
          <h2 className="member-giving-title">My Giving</h2>
          <p className="member-giving-subtitle">Track your tithes and offerings</p>
        </div>
        <div className="member-giving-header-actions">
          {canManageCategories && (
            <button
              className="member-giving-btn-categories"
              onClick={() => setShowCategories(true)}
            >
              <FiFilter size={16} />
              Categories
            </button>
          )}
          {(canUseMpesa || canUseCash) && (canCreateOwn || canCreateForOthers) && (
            <>
              {canUseMpesa && (
                <button
                  onClick={() => { setModalMode("mpesa"); setShowCreateModal(true); }}
                  className="member-giving-btn-primary"
                >
                  <FiSend size={16} />
                  Send M-Pesa
                </button>
              )}
              {canUseCash && (
                <button
                  onClick={() => { setModalMode("cash"); setShowCreateModal(true); }}
                  className="member-giving-btn-secondary"
                >
                  <FiDollarSign size={16} />
                  Record Cash
                </button>
              )}
            </>
          )}
        </div>
      </div>

      <div className="member-giving-toolbar">
        <div className="member-giving-search">
          <FiSearch className="member-giving-search-icon" />
          <input
            type="text"
            placeholder="Search by member, email, category, or notes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="member-giving-search-input"
          />
          {searchTerm && (
            <button onClick={() => setSearchTerm("")} className="member-giving-search-clear">
              <FiX size={16} />
            </button>
          )}
        </div>
        <div className="member-giving-filters">
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="member-giving-filter-select"
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
            className="member-giving-filter-select"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
            <option value="failed">Failed</option>
            <option value="refunded">Refunded</option>
          </select>
        </div>
      </div>

      <div className="member-giving-cards-grid">
        {filteredGiving.length === 0 ? (
          <div className="member-giving-empty-state">
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
              <div key={record.givingId} className="member-giving-card">
                <div className="member-giving-card-header">
                  <div className="member-giving-card-member">
                    {profilePic ? (
                      <div
                        className="member-giving-card-avatar member-giving-avatar-clickable"
                        onClick={() => openProfileImageModal(profilePic!)}
                      >
                        <img src={profilePic} alt={getMemberName(record.memberId)} />
                        <div className="member-giving-avatar-expand">
                          <FiMaximize2 size={12} />
                        </div>
                      </div>
                    ) : (
                      <div className="member-giving-card-avatar">
                        {getMemberName(record.memberId).charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div className="member-giving-card-member-info">
                      <span className="member-giving-card-member-name">{getMemberName(record.memberId)}</span>
                      <span className="member-giving-card-member-email">{getMemberEmail(record.memberId)}</span>
                    </div>
                  </div>
                  <div className="member-giving-card-status-badge">
                    <span className={`member-giving-status-badge status-${record.status}`}>
                      {record.status}
                    </span>
                  </div>
                </div>

                <div className="member-giving-card-body">
                  <div className="member-giving-card-details">
                    <div className="member-giving-card-detail">
                      <label>Category</label>
                      <span>{getCategoryName(record.categoryId)}</span>
                    </div>
                    <div className="member-giving-card-detail">
                      <label>Amount</label>
                      <span className="member-giving-card-amount">{formatCurrency(record.amount)}</span>
                    </div>
                    <div className="member-giving-card-detail">
                      <label>Date</label>
                      <span>{new Date(record.date).toLocaleDateString()}</span>
                    </div>
                    <div className="member-giving-card-detail">
                      <label>Method</label>
                      <span className="member-giving-method-badge">{record.paymentMethod || "cash"}</span>
                    </div>
                    {hasEvidence && (
                      <div className="member-giving-card-detail full-width">
                        <label>Evidence</label>
                        <button
                          className="member-giving-evidence-btn"
                          onClick={() => openEvidenceModal(record.receiptFile!)}
                        >
                          <FiEye size={16} />
                          <span>View Evidence</span>
                        </button>
                      </div>
                    )}
                    {record.notes && (
                      <div className="member-giving-card-detail full-width">
                        <label>Notes</label>
                        <span>{record.notes}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="member-giving-card-footer">
                  {canApprove && isPending && !isMpesaPending && (
                    <>
                      <button
                        onClick={() => openApproveModal(record)}
                        className="member-giving-card-btn member-giving-card-btn-approve"
                      >
                        <FiCheck size={16} />
                        Approve
                      </button>
                      <button
                        onClick={() => handleReject(record.givingId)}
                        className="member-giving-card-btn member-giving-card-btn-reject"
                        disabled={rejectingId === record.givingId}
                      >
                        {rejectingId === record.givingId ? "..." : <FiXCircle size={16} />}
                        Reject
                      </button>
                    </>
                  )}
                  {isMpesaPending && (
                    <span className="member-giving-mpesa-waiting">⏳ Waiting for M-Pesa confirmation...</span>
                  )}
                  {canManageGiving && (
                    <button
                      onClick={() => handleEdit(record)}
                      className="member-giving-card-btn member-giving-card-btn-edit"
                    >
                      Edit
                    </button>
                  )}
                  <button
                    onClick={() => handleDeleteClick(record.givingId)}
                    className="member-giving-card-btn member-giving-card-btn-delete"
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

      <CreateMyGiving
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={handleSuccess}
        churchId={churchId}
        members={members}
        categories={categories}
        mode={modalMode}
        currentMemberId={currentMemberId || undefined}
        userRole={userRole}
      />

      {editingRecord && (
        <UpdateMyGiving
          isOpen={showUpdateModal}
          onClose={() => {
            setShowUpdateModal(false);
            setEditingRecord(null);
          }}
          onSuccess={handleSuccess}
          giving={editingRecord}
          members={members}
          categories={categories}
        />
      )}
    </div>
  );
}