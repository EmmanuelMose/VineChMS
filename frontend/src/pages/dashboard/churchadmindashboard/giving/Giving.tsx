import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  FiSearch,
  FiX,
  FiCheck,
  FiXCircle,
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
import CreateGiving from "./CreateGiving";
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

  const handleApprove = async (id: number) => {
    try {
      await approveGiving(id, token);
      await loadData();
    } catch (error) {
      console.error("Failed to approve giving:", error);
    }
  };

  const handleReject = async (id: number) => {
    try {
      await rejectGiving(id, token);
      await loadData();
    } catch (error) {
      console.error("Failed to reject giving:", error);
    }
  };

  const handleSuccess = () => {
    loadData();
    setCreateModalOpen(false);
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

  const filteredGiving = giving.filter((record) => {
    const memberName = getMemberName(record.memberId).toLowerCase();
    const categoryName = getCategoryName(record.categoryId).toLowerCase();
    const matchesSearch =
      memberName.includes(searchTerm.toLowerCase()) ||
      categoryName.includes(searchTerm.toLowerCase()) ||
      (record.notes || "").toLowerCase().includes(searchTerm.toLowerCase());

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

      <div className="giving-header">
        <div>
          <h2 className="giving-title">Giving Management</h2>
          <p className="giving-subtitle">Manage all giving records, approve pending, or send STK push</p>
        </div>
        <div className="giving-header-actions">
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

      <div className="giving-two-column">
        {/* LEFT PANEL – All records */}
        <div className="giving-left-panel">
          <div className="giving-panel-header">
            <h3>All Giving Records</h3>
            <span className="giving-pending-count">{giving.length} total</span>
          </div>

          <div className="giving-toolbar">
            <div className="giving-search">
              <FiSearch className="giving-search-icon" />
              <input
                type="text"
                placeholder="Search records..."
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

          <div className="giving-table-wrapper">
            {filteredGiving.length === 0 ? (
              <div className="giving-empty-state">
                <p>No giving records found</p>
                <span>Try adjusting your filters</span>
              </div>
            ) : (
              <table className="giving-table">
                <thead>
                  <tr>
                    <th>Member</th>
                    <th>Category</th>
                    <th>Amount</th>
                    <th>Date</th>
                    <th>Method</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredGiving.map((record) => (
                    <tr key={record.givingId}>
                      <td>
                        <div className="giving-cell-member">
                          <div className="giving-avatar">
                            {getMemberName(record.memberId).charAt(0).toUpperCase()}
                          </div>
                          <span>{getMemberName(record.memberId)}</span>
                        </div>
                      </td>
                      <td>
                        <span className="giving-category-badge">
                          {getCategoryName(record.categoryId)}
                        </span>
                      </td>
                      <td className="giving-amount">{formatCurrency(record.amount)}</td>
                      <td>{new Date(record.date).toLocaleDateString()}</td>
                      <td>
                        <span className="giving-method-badge">
                          {record.paymentMethod || "cash"}
                        </span>
                      </td>
                      <td>
                        <span className={`giving-status-badge status-${record.status}`}>
                          {record.status}
                        </span>
                      </td>
                      <td>
                        <div className="giving-actions-cell">
                          {canApprove && record.status === "pending" && (
                            <>
                              <button
                                onClick={() => handleApprove(record.givingId)}
                                className="giving-action-btn giving-action-approve"
                                title="Approve"
                              >
                                <FiCheck size={16} />
                              </button>
                              <button
                                onClick={() => handleReject(record.givingId)}
                                className="giving-action-btn giving-action-reject"
                                title="Reject"
                              >
                                <FiXCircle size={16} />
                              </button>
                            </>
                          )}
                          <button
                            onClick={() => handleDeleteClick(record.givingId)}
                            className="giving-action-btn giving-action-delete"
                            title="Delete"
                          >
                            <FiX size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* RIGHT PANEL – Quick actions */}
        <div className="giving-right-panel">
          <div className="giving-panel-header">
            <h3>Quick Actions</h3>
            <span className="giving-panel-subtitle">Initiate M-Pesa or Record Cash</span>
          </div>

          <div className="giving-quick-actions">
            <button onClick={openMpesaModal} className="giving-quick-btn mpesa">
              <FiSend size={20} />
              <span>Send M-Pesa STK Push</span>
              <small>Select member and send</small>
            </button>
            <button onClick={openCashModal} className="giving-quick-btn cash">
              <FiDollarSign size={20} />
              <span>Record Cash Giving</span>
              <small>Mark payment as completed</small>
            </button>
          </div>

          <div className="giving-info-box">
            <h4>📌 Quick Tips</h4>
            <ul>
              <li><strong>M-Pesa:</strong> Select member, enter amount → STK push sent → auto-completes</li>
              <li><strong>Cash:</strong> Record payment directly → marked as completed</li>
              <li><strong>Pending:</strong> Records awaiting approval (from members)</li>
              <li><strong>Use filters</strong> to view specific statuses</li>
            </ul>
          </div>
        </div>
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