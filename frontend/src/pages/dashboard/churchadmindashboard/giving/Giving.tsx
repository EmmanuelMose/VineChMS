import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { FiSearch, FiX, FiPlus, FiEdit2, FiTrash2, FiFilter } from "react-icons/fi";
import { fetchGiving, deleteGiving, type Giving } from "../../../../Features/giving/givingAPI";
import { fetchMembers, type Member } from "../../../../Features/members/membersAPI";
import CreateGiving from "./CreateGiving";
import UpdateGiving from "./UpdateGiving";
import GivingCategories from "./GivingCategories";
import "./Giving.css";

export default function Giving() {
  const token = useSelector((state: any) => state.user.token);
  const churchId = useSelector((state: any) => state.user.user?.churchId);
  
  const [giving, setGiving] = useState<Giving[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [selectedGiving, setSelectedGiving] = useState<Giving | null>(null);
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);
  const [showCategories, setShowCategories] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [givingData, membersData] = await Promise.all([
        fetchGiving(token),
        fetchMembers(token),
      ]);
      const filteredGiving = givingData.filter(g => g.churchId === churchId);
      setGiving(filteredGiving);
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

  const handleEdit = (record: Giving) => {
    setSelectedGiving(record);
    setUpdateModalOpen(true);
  };

  const handleSuccess = () => {
    loadData();
    setCreateModalOpen(false);
    setUpdateModalOpen(false);
    setSelectedGiving(null);
  };

  const getMemberName = (memberId: number) => {
    const member = members.find(m => m.memberId === memberId);
    return member ? member.fullName : "Unknown";
  };

  const formatCurrency = (amount: string) => {
    const num = parseFloat(amount);
    if (isNaN(num)) return "$0.00";
    return "$" + num.toFixed(2);
  };

  const filteredGiving = giving.filter(record => {
    const memberName = getMemberName(record.memberId).toLowerCase();
    const matchesSearch = 
      memberName.includes(searchTerm.toLowerCase()) ||
      (record.notes || "").toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = filterType === "all" || record.type === filterType;
    const matchesStatus = filterStatus === "all" || record.status === filterStatus;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  const stats = {
    total: giving.reduce((sum, g) => sum + parseFloat(g.amount), 0),
    tithes: giving.filter(g => g.type === "tithe").reduce((sum, g) => sum + parseFloat(g.amount), 0),
    offerings: giving.filter(g => g.type === "offering").reduce((sum, g) => sum + parseFloat(g.amount), 0),
    donations: giving.filter(g => g.type === "donation").reduce((sum, g) => sum + parseFloat(g.amount), 0),
    special: giving.filter(g => g.type === "special").reduce((sum, g) => sum + parseFloat(g.amount), 0),
    count: giving.length,
  };

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

      <div className="giving-header">
        <div>
          <h2 className="giving-title">Giving & Donations</h2>
          <p className="giving-subtitle">Track and manage church giving records</p>
        </div>
        <div className="giving-actions">
          <button onClick={() => setShowCategories(true)} className="giving-btn-secondary">
            <FiFilter size={16} />
            Categories
          </button>
          <button onClick={() => setCreateModalOpen(true)} className="giving-btn-primary">
            <FiPlus size={16} />
            Record Giving
          </button>
        </div>
      </div>

      <div className="giving-stats-grid">
        <div className="giving-stat-card stat-total">
          <span className="giving-stat-value">{formatCurrency(stats.total.toString())}</span>
          <span className="giving-stat-label">Total Giving</span>
        </div>
        <div className="giving-stat-card stat-tithe">
          <span className="giving-stat-value">{formatCurrency(stats.tithes.toString())}</span>
          <span className="giving-stat-label">Tithes</span>
        </div>
        <div className="giving-stat-card stat-offering">
          <span className="giving-stat-value">{formatCurrency(stats.offerings.toString())}</span>
          <span className="giving-stat-label">Offerings</span>
        </div>
        <div className="giving-stat-card stat-donation">
          <span className="giving-stat-value">{formatCurrency(stats.donations.toString())}</span>
          <span className="giving-stat-label">Donations</span>
        </div>
        <div className="giving-stat-card stat-special">
          <span className="giving-stat-value">{formatCurrency(stats.special.toString())}</span>
          <span className="giving-stat-label">Special</span>
        </div>
        <div className="giving-stat-card stat-count">
          <span className="giving-stat-value">{stats.count}</span>
          <span className="giving-stat-label">Total Records</span>
        </div>
      </div>

      <div className="giving-toolbar">
        <div className="giving-search">
          <FiSearch className="giving-search-icon" />
          <input
            type="text"
            placeholder="Search by member or notes..."
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
            value={filterType} 
            onChange={(e) => setFilterType(e.target.value)}
            className="giving-filter-select"
          >
            <option value="all">All Types</option>
            <option value="tithe">Tithe</option>
            <option value="offering">Offering</option>
            <option value="donation">Donation</option>
            <option value="special">Special</option>
            <option value="pledge">Pledge</option>
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
        <table className="giving-table">
          <thead>
            <tr>
              <th>Member</th>
              <th>Type</th>
              <th>Amount</th>
              <th>Date</th>
              <th>Status</th>
              <th>Payment Method</th>
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
                  <span className="giving-type-badge">
                    {record.type}
                  </span>
                </td>
                <td className="giving-amount">{formatCurrency(record.amount)}</td>
                <td>{new Date(record.date).toLocaleDateString()}</td>
                <td>
                  <span className={`giving-status-badge status-${record.status}`}>
                    {record.status}
                  </span>
                </td>
                <td>{record.paymentMethod || "—"}</td>
                <td>
                  <div className="giving-actions-cell">
                    <button onClick={() => handleEdit(record)} className="giving-action-btn giving-action-edit" title="Edit">
                      <FiEdit2 size={16} />
                    </button>
                    <button onClick={() => handleDeleteClick(record.givingId)} className="giving-action-btn giving-action-delete" title="Delete">
                      <FiTrash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filteredGiving.length === 0 && (
              <tr>
                <td colSpan={7} className="giving-empty">
                  No giving records found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <CreateGiving
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSuccess={handleSuccess}
        churchId={churchId}
        members={members}
      />

      {selectedGiving && (
        <UpdateGiving
          isOpen={updateModalOpen}
          onClose={() => {
            setUpdateModalOpen(false);
            setSelectedGiving(null);
          }}
          onSuccess={handleSuccess}
          giving={selectedGiving}
          members={members}
        />
      )}
    </div>
  );
}