import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { FiSearch, FiX, FiUserPlus, FiCheckCircle, FiXCircle, FiEdit2, FiTrash2 } from "react-icons/fi";
import { fetchLeaders, deleteLeader, approveLeader, revokeLeaderApproval, type Leader, updateLeader } from "../../../../Features/leaders/leadersAPI";
import { fetchPositions, type Position } from "../../../../Features/positions/positionsAPI";
import { fetchMembers, type Member } from "../../../../Features/members/membersAPI";
import CreateLeader from "./CreateLeader";
import UpdateLeader from "./UpdateLeader";
import "./Leaders.css";

export default function Leaders() {
  const token = useSelector((state: any) => state.user.token);
  
  const [leaders, setLeaders] = useState<Leader[]>([]);
  const [positions, setPositions] = useState<Position[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [selectedLeader, setSelectedLeader] = useState<Leader | null>(null);
  const [filterStatus, setFilterStatus] = useState("all");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [statusTarget, setStatusTarget] = useState<{ id: number; currentStatus: boolean } | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [leadersData, positionsData, membersData] = await Promise.all([
        fetchLeaders(token),
        fetchPositions(token),
        fetchMembers(token),
      ]);
      setLeaders(leadersData);
      setPositions(positionsData);
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
        await deleteLeader(deleteTargetId, token);
        await loadData();
        setShowDeleteModal(false);
        setDeleteTargetId(null);
      } catch (error) {
        console.error("Failed to delete leader:", error);
      }
    }
  };

  const handleToggleStatus = (leader: Leader) => {
    setStatusTarget({ id: leader.leaderId, currentStatus: leader.isActive });
    setShowStatusModal(true);
  };

  const confirmStatusToggle = async () => {
    if (statusTarget) {
      try {
        await updateLeader(statusTarget.id, { isActive: !statusTarget.currentStatus }, token);
        await loadData();
        setShowStatusModal(false);
        setStatusTarget(null);
      } catch (error) {
        console.error("Failed to update leader status:", error);
      }
    }
  };

  const handleApprove = async (id: number) => {
    try {
      await approveLeader(id, token);
      await loadData();
    } catch (error) {
      console.error("Failed to approve leader:", error);
    }
  };

  const handleRevoke = async (id: number) => {
    try {
      await revokeLeaderApproval(id, token);
      await loadData();
    } catch (error) {
      console.error("Failed to revoke approval:", error);
    }
  };

  const handleEdit = (leader: Leader) => {
    setSelectedLeader(leader);
    setUpdateModalOpen(true);
  };

  const handleSuccess = () => {
    loadData();
    setCreateModalOpen(false);
    setUpdateModalOpen(false);
    setSelectedLeader(null);
  };

  const filteredLeaders = leaders.filter(leader => {
    const matchesSearch = 
      (leader.fullName || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (leader.email || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (leader.positionName || "").toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = 
      filterStatus === "all" ||
      (filterStatus === "active" && leader.isActive) ||
      (filterStatus === "inactive" && !leader.isActive) ||
      (filterStatus === "approved" && leader.isApproved) ||
      (filterStatus === "pending" && !leader.isApproved && leader.isActive);
    
    return matchesSearch && matchesFilter;
  });

  const getPositionName = (positionId: number) => {
    const position = positions.find(p => p.positionId === positionId);
    return position ? position.name : "Unknown";
  };

  if (loading) {
    return (
      <div className="leaders-loading">
        <div className="leaders-loading-spinner"></div>
        <p>Loading leaders...</p>
      </div>
    );
  }

  return (
    <div className="leaders-page">
      {showDeleteModal && (
        <div className="leaders-modal-overlay" onClick={() => setShowDeleteModal(false)}>
          <div className="leaders-modal leaders-modal-confirm" onClick={(e) => e.stopPropagation()}>
            <div className="leaders-modal-header">
              <h3>Delete Leader</h3>
              <button onClick={() => setShowDeleteModal(false)} className="leaders-modal-close">
                <FiX size={20} />
              </button>
            </div>
            <div className="leaders-modal-body">
              <p>Are you sure you want to permanently delete this leader?</p>
              <p className="leaders-modal-warning">This action cannot be undone. All associated data will be removed.</p>
            </div>
            <div className="leaders-modal-actions">
              <button onClick={() => setShowDeleteModal(false)} className="leaders-btn-cancel">
                Cancel
              </button>
              <button onClick={confirmDelete} className="leaders-btn-danger">
                Delete Permanently
              </button>
            </div>
          </div>
        </div>
      )}

      {showStatusModal && (
        <div className="leaders-modal-overlay" onClick={() => setShowStatusModal(false)}>
          <div className="leaders-modal leaders-modal-confirm" onClick={(e) => e.stopPropagation()}>
            <div className="leaders-modal-header">
              <h3>{statusTarget?.currentStatus ? "Deactivate" : "Activate"} Leader</h3>
              <button onClick={() => setShowStatusModal(false)} className="leaders-modal-close">
                <FiX size={20} />
              </button>
            </div>
            <div className="leaders-modal-body">
              <p>Are you sure you want to {statusTarget?.currentStatus ? "deactivate" : "activate"} this leader?</p>
              <p className="leaders-modal-info">
                {statusTarget?.currentStatus 
                  ? "Deactivated leaders will not be able to access leadership roles until reactivated."
                  : "Activated leaders will have full access to their leadership roles."}
              </p>
            </div>
            <div className="leaders-modal-actions">
              <button onClick={() => setShowStatusModal(false)} className="leaders-btn-cancel">
                Cancel
              </button>
              <button onClick={confirmStatusToggle} className={`leaders-btn-${statusTarget?.currentStatus ? "warning" : "success"}`}>
                {statusTarget?.currentStatus ? "Deactivate" : "Activate"}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="leaders-header">
        <div>
          <h2 className="leaders-title">Leaders</h2>
          <p className="leaders-subtitle">Manage church leadership and positions</p>
        </div>
        <div className="leaders-actions">
          <button onClick={() => setCreateModalOpen(true)} className="leaders-btn-primary">
            <FiUserPlus size={18} />
            Add Leader
          </button>
        </div>
      </div>

      <div className="leaders-toolbar">
        <div className="leaders-search">
          <FiSearch className="leaders-search-icon" />
          <input
            type="text"
            placeholder="Search leaders..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="leaders-search-input"
          />
          {searchTerm && (
            <button onClick={() => setSearchTerm("")} className="leaders-search-clear">
              <FiX size={16} />
            </button>
          )}
        </div>
        <div className="leaders-filters">
          <select 
            value={filterStatus} 
            onChange={(e) => setFilterStatus(e.target.value)}
            className="leaders-filter-select"
          >
            <option value="all">All Leaders</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="approved">Approved</option>
            <option value="pending">Pending Approval</option>
          </select>
        </div>
      </div>

      <div className="leaders-table-wrapper">
        <table className="leaders-table">
          <thead>
            <tr>
              <th>Leader</th>
              <th>Position</th>
              <th>Start Date</th>
              <th>Status</th>
              <th>Approval</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredLeaders.map((leader) => (
              <tr key={leader.leaderId}>
                <td>
                  <div className="leaders-cell-member">
                    <div className="leaders-avatar">
                      {(leader.fullName || "U").charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="leaders-cell-name">{leader.fullName || "Unknown"}</div>
                      <div className="leaders-cell-email">{leader.email || "No email"}</div>
                    </div>
                  </div>
                </td>
                <td>{leader.positionName || getPositionName(leader.positionId)}</td>
                <td>{new Date(leader.startDate).toLocaleDateString()}</td>
                <td>
                  <span className={`leaders-status-badge ${leader.isActive ? "status-active" : "status-inactive"}`}>
                    {leader.isActive ? "Active" : "Inactive"}
                  </span>
                </td>
                <td>
                  <span className={`leaders-approval-badge ${leader.isApproved ? "approval-approved" : "approval-pending"}`}>
                    {leader.isApproved ? "Approved" : "Pending"}
                  </span>
                </td>
                <td>
                  <div className="leaders-actions-cell">
                    {!leader.isApproved && leader.isActive && (
                      <button onClick={() => handleApprove(leader.leaderId)} className="leaders-action-btn leaders-action-approve" title="Approve">
                        <FiCheckCircle size={16} />
                      </button>
                    )}
                    {leader.isApproved && (
                      <button onClick={() => handleRevoke(leader.leaderId)} className="leaders-action-btn leaders-action-revoke" title="Revoke Approval">
                        <FiXCircle size={16} />
                      </button>
                    )}
                    <button onClick={() => handleEdit(leader)} className="leaders-action-btn leaders-action-edit" title="Edit">
                      <FiEdit2 size={16} />
                    </button>
                    <button onClick={() => handleToggleStatus(leader)} className={`leaders-action-btn ${leader.isActive ? "leaders-action-warning" : "leaders-action-success"}`} title={leader.isActive ? "Deactivate" : "Activate"}>
                      {leader.isActive ? <FiXCircle size={16} /> : <FiCheckCircle size={16} />}
                    </button>
                    <button onClick={() => handleDeleteClick(leader.leaderId)} className="leaders-action-btn leaders-action-delete" title="Delete Permanently">
                      <FiTrash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filteredLeaders.length === 0 && (
              <tr>
                <td colSpan={6} className="leaders-empty">
                  No leaders found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <CreateLeader
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSuccess={handleSuccess}
        positions={positions}
        members={members}
      />

      {selectedLeader && (
        <UpdateLeader
          isOpen={updateModalOpen}
          onClose={() => {
            setUpdateModalOpen(false);
            setSelectedLeader(null);
          }}
          onSuccess={handleSuccess}
          leader={selectedLeader}
          positions={positions}
          members={members}
        />
      )}
    </div>
  );
}