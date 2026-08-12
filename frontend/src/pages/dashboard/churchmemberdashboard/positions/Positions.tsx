import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { fetchPositions, createPosition, updatePosition, deletePosition, type Position } from "../../../../Features/positions/positionsAPI";
import { fetchLeaders, createLeader, deleteLeader, type Leader } from "../../../../Features/leaders/leadersAPI";
import { fetchMembers, type Member } from "../../../../Features/members/membersAPI";
import { fetchMemberByUserId } from "../../../../Features/members/membersAPI";
import { getPositionIcon } from "../../../../utils/permissions";
import { FiPlus, FiEdit2, FiTrash2, FiUserPlus, FiX } from "react-icons/fi";
import "./Positions.css";

export default function Positions() {
  const token = useSelector((state: any) => state.user.token);
  const churchId = useSelector((state: any) => state.user.user?.churchId);
  const userId = useSelector((state: any) => state.user.user?.userId);
  const userRole = useSelector((state: any) => state.user.user?.role);

  const [positions, setPositions] = useState<Position[]>([]);
  const [leaders, setLeaders] = useState<Leader[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [memberId, setMemberId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredPositions, setFilteredPositions] = useState<Position[]>([]);
  const [selectedPosition, setSelectedPosition] = useState<Position | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [editingPosition, setEditingPosition] = useState<Position | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [assignPositionId, setAssignPositionId] = useState<number | null>(null);
  const [selectedMemberId, setSelectedMemberId] = useState<number | null>(null);
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [removeLeaderId, setRemoveLeaderId] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    isActive: true,
  });

  const canManagePositions = userRole === "church_admin" || userRole === "pastor" || userRole === "elder";
  const canAssign = userRole === "church_admin" || userRole === "secretary" || userRole === "pastor";

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
    loadData();
  }, [memberId]);

  useEffect(() => {
    filterPositions();
  }, [positions, searchTerm]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [positionsData, leadersData, membersData] = await Promise.all([
        fetchPositions(token),
        fetchLeaders(token),
        fetchMembers(token),
      ]);
      const churchPositions = positionsData.filter((p) => p.churchId === churchId);
      const churchLeaders = leadersData.filter((l) => {
        const position = churchPositions.find((p) => p.positionId === l.positionId);
        return position !== undefined;
      });
      const churchMembers = membersData.filter((m) => m.churchId === churchId);
      setPositions(churchPositions);
      setLeaders(churchLeaders);
      setMembers(churchMembers);
    } catch (error) {
      console.error("Failed to load data:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterPositions = () => {
    let filtered = [...positions];
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(term) ||
          (p.description || "").toLowerCase().includes(term)
      );
    }
    setFilteredPositions(filtered);
  };

  const getLeadersForPosition = (positionId: number) => {
    return leaders.filter((l) => l.positionId === positionId);
  };

  const getPositionIconDisplay = (name: string) => {
    return getPositionIcon(name);
  };

  const isUserLeader = (positionId: number) => {
    if (!memberId) return false;
    return leaders.some((l) => l.positionId === positionId && l.memberId === memberId && l.isActive);
  };



  const getUnassignedMembers = () => {
    const assignedMemberIds = leaders.map((l) => l.memberId);
    return members.filter((m) => !assignedMemberIds.includes(m.memberId));
  };

  const handleViewDetails = (position: Position) => {
    setSelectedPosition(position);
    setShowDetailModal(true);
  };

  const handleCreate = () => {
    setEditingPosition(null);
    setFormData({
      name: "",
      description: "",
      isActive: true,
    });
    setShowCreateModal(true);
  };

  const handleEdit = (position: Position) => {
    setEditingPosition(position);
    setFormData({
      name: position.name,
      description: position.description || "",
      isActive: position.isActive,
    });
    setShowUpdateModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        churchId: churchId!,
        name: formData.name,
        description: formData.description || undefined,
        isActive: formData.isActive,
      };

      if (editingPosition) {
        await updatePosition(editingPosition.positionId, payload, token);
      } else {
        await createPosition(payload, token);
      }
      setShowCreateModal(false);
      setShowUpdateModal(false);
      await loadData();
    } catch (error: any) {
      console.error("Failed to save position:", error);
      alert(error.response?.data?.message || "Failed to save position.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTargetId) return;
    try {
      await deletePosition(deleteTargetId, token);
      setShowDeleteModal(false);
      setDeleteTargetId(null);
      await loadData();
    } catch (error) {
      console.error("Failed to delete position:", error);
      alert("Failed to delete position.");
    }
  };

  const handleAssignClick = (positionId: number) => {
    setAssignPositionId(positionId);
    setSelectedMemberId(null);
    setShowAssignModal(true);
  };

  const handleAssign = async () => {
    if (!assignPositionId || !selectedMemberId) return;
    setSubmitting(true);
    try {
      await createLeader({
        memberId: selectedMemberId,
        positionId: assignPositionId,
        startDate: new Date().toISOString(),
        isActive: true,
        isApproved: true,
      }, token);
      setShowAssignModal(false);
      setAssignPositionId(null);
      setSelectedMemberId(null);
      await loadData();
      alert("Member assigned to position successfully!");
    } catch (error: any) {
      console.error("Failed to assign member:", error);
      alert(error.response?.data?.message || "Failed to assign member.");
    } finally {
      setSubmitting(false);
    }
  };


  const handleRemove = async () => {
    if (!removeLeaderId) return;
    try {
      await deleteLeader(removeLeaderId, token);
      setShowRemoveModal(false);
      setRemoveLeaderId(null);
      await loadData();
      alert("Member removed from position successfully!");
    } catch (error) {
      console.error("Failed to remove member:", error);
      alert("Failed to remove member.");
    }
  };


  if (loading) {
    return (
      <div className="member-positions-loading">
        <div className="member-positions-loading-spinner"></div>
        <p>Loading positions...</p>
      </div>
    );
  }

  return (
    <div className="member-positions-page">
      <div className="member-positions-header">
        <div>
          <h2 className="member-positions-title">Leadership Positions</h2>
          <p className="member-positions-subtitle">View and manage leadership positions in the church</p>
        </div>
        {canManagePositions && (
          <button className="member-positions-add-btn" onClick={handleCreate}>
            <FiPlus size={18} />
            Create Position
          </button>
        )}
      </div>

      <div className="member-positions-search">
        <input
          type="text"
          placeholder="Search positions..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="member-positions-search-input"
        />
      </div>

      <div className="member-positions-grid">
        {filteredPositions.length > 0 ? (
          filteredPositions.map((position) => {
            const positionLeaders = getLeadersForPosition(position.positionId);
            const icon = getPositionIconDisplay(position.name);
            const userIsLeader = isUserLeader(position.positionId);
            return (
              <div key={position.positionId} className="member-positions-card">
                <div className="member-positions-card-header">
                  <div className="member-positions-card-icon">{icon}</div>
                  <div className="member-positions-card-info">
                    <h3 className="member-positions-card-title">{position.name}</h3>
                    {userIsLeader && (
                      <span className="member-positions-badge-leader">Your Position</span>
                    )}
                    <span className={`member-positions-card-status ${position.isActive ? "status-active" : "status-inactive"}`}>
                      {position.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>
                </div>
                {position.description && (
                  <p className="member-positions-card-description">{position.description}</p>
                )}
                <div className="member-positions-card-members">
                  <span className="member-positions-members-count">
                    👥 {positionLeaders.length} members in this position
                  </span>
                </div>
                <div className="member-positions-card-actions">
                  <button 
                    className="member-positions-btn-view" 
                    onClick={() => handleViewDetails(position)}
                  >
                    View Details
                  </button>
                  {canManagePositions && (
                    <>
                      <button
                        className="member-positions-btn-edit"
                        onClick={() => handleEdit(position)}
                      >
                        <FiEdit2 size={14} /> Edit
                      </button>
                      <button
                        className="member-positions-btn-delete"
                        onClick={() => {
                          setDeleteTargetId(position.positionId);
                          setShowDeleteModal(true);
                        }}
                      >
                        <FiTrash2 size={14} /> Delete
                      </button>
                    </>
                  )}
                  {canAssign && (
                    <button
                      className="member-positions-btn-assign"
                      onClick={() => handleAssignClick(position.positionId)}
                    >
                      <FiUserPlus size={14} /> Assign
                    </button>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <div className="member-positions-empty">
            <p>No positions found</p>
            {canManagePositions && <span>Create your first leadership position</span>}
          </div>
        )}
      </div>

      {showCreateModal && (
        <div className="member-positions-modal-overlay" onClick={() => setShowCreateModal(false)}>
          <div className="member-positions-modal" onClick={(e) => e.stopPropagation()}>
            <div className="member-positions-modal-header">
              <h3>Create Position</h3>
              <button className="member-positions-modal-close" onClick={() => setShowCreateModal(false)}>
                <FiX size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="member-positions-modal-form">
              <div className="member-positions-form-group">
                <label>Position Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Chairman, Secretary, Treasurer"
                  required
                />
              </div>
              <div className="member-positions-form-group">
                <label>Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  placeholder="Describe the responsibilities of this position"
                />
              </div>
              <div className="member-positions-form-group">
                <label>Status</label>
                <select
                  value={formData.isActive ? "active" : "inactive"}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.value === "active" })}
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
              <div className="member-positions-modal-actions">
                <button
                  type="button"
                  className="member-positions-modal-cancel"
                  onClick={() => setShowCreateModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="member-positions-modal-submit"
                  disabled={submitting}
                >
                  {submitting ? "Creating..." : "Create Position"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showUpdateModal && editingPosition && (
        <div className="member-positions-modal-overlay" onClick={() => setShowUpdateModal(false)}>
          <div className="member-positions-modal" onClick={(e) => e.stopPropagation()}>
            <div className="member-positions-modal-header">
              <h3>Edit Position</h3>
              <button className="member-positions-modal-close" onClick={() => setShowUpdateModal(false)}>
                <FiX size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="member-positions-modal-form">
              <div className="member-positions-form-group">
                <label>Position Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div className="member-positions-form-group">
                <label>Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                />
              </div>
              <div className="member-positions-form-group">
                <label>Status</label>
                <select
                  value={formData.isActive ? "active" : "inactive"}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.value === "active" })}
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
              <div className="member-positions-modal-actions">
                <button
                  type="button"
                  className="member-positions-modal-cancel"
                  onClick={() => setShowUpdateModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="member-positions-modal-submit"
                  disabled={submitting}
                >
                  {submitting ? "Updating..." : "Update Position"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showDeleteModal && (
        <div className="member-positions-modal-overlay" onClick={() => setShowDeleteModal(false)}>
          <div className="member-positions-modal member-positions-modal-small" onClick={(e) => e.stopPropagation()}>
            <div className="member-positions-modal-header">
              <h3>Delete Position</h3>
              <button className="member-positions-modal-close" onClick={() => setShowDeleteModal(false)}>
                <FiX size={20} />
              </button>
            </div>
            <div className="member-positions-modal-body">
              <p>Are you sure you want to delete this position?</p>
              <p className="member-positions-modal-warning">This action cannot be undone.</p>
            </div>
            <div className="member-positions-modal-actions">
              <button className="member-positions-modal-cancel" onClick={() => setShowDeleteModal(false)}>
                Cancel
              </button>
              <button className="member-positions-modal-danger" onClick={handleDelete}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {showAssignModal && (
        <div className="member-positions-modal-overlay" onClick={() => setShowAssignModal(false)}>
          <div className="member-positions-modal" onClick={(e) => e.stopPropagation()}>
            <div className="member-positions-modal-header">
              <h3>Assign Member to Position</h3>
              <button className="member-positions-modal-close" onClick={() => setShowAssignModal(false)}>
                <FiX size={20} />
              </button>
            </div>
            <div className="member-positions-modal-body">
              <div className="member-positions-form-group">
                <label>Select Member</label>
                <select
                  value={selectedMemberId || ""}
                  onChange={(e) => setSelectedMemberId(parseInt(e.target.value))}
                  className="member-positions-select"
                >
                  <option value="">Choose a member...</option>
                  {getUnassignedMembers().map((member) => (
                    <option key={member.memberId} value={member.memberId}>
                      {member.fullName} ({member.email})
                    </option>
                  ))}
                </select>
              </div>
              {getUnassignedMembers().length === 0 && (
                <p className="member-positions-no-members">All members are already assigned to positions.</p>
              )}
            </div>
            <div className="member-positions-modal-actions">
              <button
                type="button"
                className="member-positions-modal-cancel"
                onClick={() => setShowAssignModal(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="member-positions-modal-submit"
                onClick={handleAssign}
                disabled={!selectedMemberId || submitting}
              >
                {submitting ? "Assigning..." : "Assign Member"}
              </button>
            </div>
          </div>
        </div>
      )}

      {showRemoveModal && (
        <div className="member-positions-modal-overlay" onClick={() => setShowRemoveModal(false)}>
          <div className="member-positions-modal member-positions-modal-small" onClick={(e) => e.stopPropagation()}>
            <div className="member-positions-modal-header">
              <h3>Remove Member</h3>
              <button className="member-positions-modal-close" onClick={() => setShowRemoveModal(false)}>
                <FiX size={20} />
              </button>
            </div>
            <div className="member-positions-modal-body">
              <p>Are you sure you want to remove this member from the position?</p>
              <p className="member-positions-modal-warning">This action cannot be undone.</p>
            </div>
            <div className="member-positions-modal-actions">
              <button className="member-positions-modal-cancel" onClick={() => setShowRemoveModal(false)}>
                Cancel
              </button>
              <button className="member-positions-modal-danger" onClick={handleRemove}>
                Remove
              </button>
            </div>
          </div>
        </div>
      )}

      {showDetailModal && selectedPosition && (
        <div className="member-positions-modal-overlay" onClick={() => setShowDetailModal(false)}>
          <div className="member-positions-modal" onClick={(e) => e.stopPropagation()}>
            <div className="member-positions-modal-header">
              <h3>{selectedPosition.name}</h3>
              <button className="member-positions-modal-close" onClick={() => setShowDetailModal(false)}>
                <FiX size={20} />
              </button>
            </div>
            <div className="member-positions-detail-content">
              <div className="member-positions-detail-row">
                <span className="member-positions-detail-label">Position:</span>
                <span className="member-positions-detail-value">{selectedPosition.name}</span>
              </div>
              {selectedPosition.description && (
                <div className="member-positions-detail-row">
                  <span className="member-positions-detail-label">Description:</span>
                  <span className="member-positions-detail-value">{selectedPosition.description}</span>
                </div>
              )}
              <div className="member-positions-detail-row">
                <span className="member-positions-detail-label">Members:</span>
                <span className="member-positions-detail-value">
                  {getLeadersForPosition(selectedPosition.positionId).length}
                </span>
              </div>
              <div className="member-positions-detail-row">
                <span className="member-positions-detail-label">Status:</span>
                <span className={`member-positions-detail-status ${selectedPosition.isActive ? "status-active" : "status-inactive"}`}>
                  {selectedPosition.isActive ? "Active" : "Inactive"}
                </span>
              </div>
              <div className="member-positions-detail-row">
                <span className="member-positions-detail-label">Created:</span>
                <span className="member-positions-detail-value">
                  {new Date(selectedPosition.createdAt).toLocaleDateString()}
                </span>
              </div>
              {isUserLeader(selectedPosition.positionId) && (
                <div className="member-positions-detail-leader-badge">
                  You are a leader in this position
                </div>
              )}
              {canManagePositions && (
                <div className="member-positions-detail-actions">
                  <button
                    className="member-positions-btn-assign"
                    onClick={() => {
                      setShowDetailModal(false);
                      handleAssignClick(selectedPosition.positionId);
                    }}
                  >
                    <FiUserPlus size={14} /> Assign Member
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}