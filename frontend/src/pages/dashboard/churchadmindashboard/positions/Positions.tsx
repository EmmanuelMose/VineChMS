import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { fetchPositions, createPosition, updatePosition, deletePosition, type Position } from "../../../../Features/positions/positionsAPI";
import { fetchMembers, type Member } from "../../../../Features/members/membersAPI";
import { createLeader, deleteLeader, fetchLeaders, type Leader } from "../../../../Features/leaders/leadersAPI";
import { getPositionIcon } from "../../../../utils/permissions";
import "./Positions.css";

export default function Positions() {
  const token = useSelector((state: any) => state.user.token);
  const churchId = useSelector((state: any) => state.user.user?.churchId);
  const userRole = useSelector((state: any) => state.user.user?.role);

  const [positions, setPositions] = useState<Position[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [leaders, setLeaders] = useState<Leader[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingPosition, setEditingPosition] = useState<Position | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredPositions, setFilteredPositions] = useState<Position[]>([]);
  const [selectedPosition, setSelectedPosition] = useState<Position | null>(null);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showPositionMembersModal, setShowPositionMembersModal] = useState(false);
  const [selectedMemberId, setSelectedMemberId] = useState<number | null>(null);
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [removeLeaderId, setRemoveLeaderId] = useState<number | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    isActive: true,
  });

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    filterPositions();
  }, [positions, searchTerm]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [positionsData, membersData, leadersData] = await Promise.all([
        fetchPositions(token),
        fetchMembers(token),
        fetchLeaders(token),
      ]);
      const churchPositions = positionsData.filter((p) => p.churchId === churchId);
      const churchMembers = membersData.filter((m) => m.churchId === churchId);
      const churchLeaders = leadersData.filter((l) => {
        const member = churchMembers.find((m) => m.memberId === l.memberId);
        return member !== undefined;
      });
      setPositions(churchPositions);
      setMembers(churchMembers);
      setLeaders(churchLeaders);
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

  const isAdmin = userRole === "church_admin" || userRole === "pastor" || userRole === "elder";

  const handleCreate = () => {
    setEditingPosition(null);
    setFormData({
      name: "",
      description: "",
      isActive: true,
    });
    setShowModal(true);
  };

  const handleEdit = (position: Position) => {
    setEditingPosition(position);
    setFormData({
      name: position.name,
      description: position.description || "",
      isActive: position.isActive,
    });
    setShowModal(true);
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
      setShowModal(false);
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

  const handleAssignMember = async () => {
    if (!selectedPosition || !selectedMemberId) return;
    setSubmitting(true);
    try {
      await createLeader({
        memberId: selectedMemberId,
        positionId: selectedPosition.positionId,
        startDate: new Date().toISOString(),
        isActive: true,
        isApproved: true,
      }, token);
      setShowAssignModal(false);
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

  const handleRemoveFromPosition = async () => {
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

  const getLeadersForPosition = (positionId: number) => {
    return leaders.filter((l) => l.positionId === positionId);
  };

  const getMemberName = (memberId: number) => {
    const member = members.find((m) => m.memberId === memberId);
    return member ? member.fullName : "Unknown";
  };

  const getMemberEmail = (memberId: number) => {
    const member = members.find((m) => m.memberId === memberId);
    return member ? member.email : "";
  };

  const getUnassignedMembers = () => {
    const assignedMemberIds = leaders.map((l) => l.memberId);
    return members.filter((m) => !assignedMemberIds.includes(m.memberId));
  };

  const getPositionIconDisplay = (name: string) => {
    return getPositionIcon(name);
  };

  if (loading) {
    return (
      <div className="admin-positions-loading">
        <div className="admin-positions-loading-spinner"></div>
        <p>Loading positions...</p>
      </div>
    );
  }

  return (
    <div className="admin-positions-page">
      <div className="admin-positions-header">
        <div>
          <h2 className="admin-positions-title">Leadership Positions</h2>
          <p className="admin-positions-subtitle">Manage church leadership positions and assign members</p>
        </div>
        {isAdmin && (
          <button className="admin-positions-add-btn" onClick={handleCreate}>
            Create Position
          </button>
        )}
      </div>

      <div className="admin-positions-search">
        <input
          type="text"
          placeholder="Search positions..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="admin-positions-search-input"
        />
      </div>

      <div className="admin-positions-grid">
        {filteredPositions.length > 0 ? (
          filteredPositions.map((position) => {
            const positionLeaders = getLeadersForPosition(position.positionId);
            const icon = getPositionIconDisplay(position.name);
            return (
              <div key={position.positionId} className="admin-positions-card">
                <div className="admin-positions-card-header">
                  <div className="admin-positions-card-icon">{icon}</div>
                  <div className="admin-positions-card-info">
                    <h3 className="admin-positions-card-title">{position.name}</h3>
                    <span className={`admin-positions-card-status ${position.isActive ? "status-active" : "status-inactive"}`}>
                      {position.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>
                </div>
                {position.description && (
                  <p className="admin-positions-card-description">{position.description}</p>
                )}
                <div className="admin-positions-card-members">
                  <span className="admin-positions-members-count">
                    👥 {positionLeaders.length} members assigned
                  </span>
                </div>
                <div className="admin-positions-card-actions">
                  <button 
                    className="admin-positions-btn-view" 
                    onClick={() => {
                      setSelectedPosition(position);
                      setShowPositionMembersModal(true);
                    }}
                  >
                    View Members
                  </button>
                  {isAdmin && (
                    <>
                      <button 
                        className="admin-positions-btn-assign" 
                        onClick={() => {
                          setSelectedPosition(position);
                          setShowAssignModal(true);
                        }}
                      >
                        Assign Member
                      </button>
                      <button className="admin-positions-btn-edit" onClick={() => handleEdit(position)}>
                        Edit
                      </button>
                      <button
                        className="admin-positions-btn-delete"
                        onClick={() => {
                          setDeleteTargetId(position.positionId);
                          setShowDeleteModal(true);
                        }}
                      >
                        Delete
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <div className="admin-positions-empty">
            <p>No positions found</p>
            {isAdmin && <span>Create your first leadership position</span>}
          </div>
        )}
      </div>

      {showModal && (
        <div className="admin-positions-modal-overlay" onClick={() => setShowModal(false)}>
          <div className="admin-positions-modal" onClick={(e) => e.stopPropagation()}>
            <div className="admin-positions-modal-header">
              <h3>{editingPosition ? "Edit Position" : "Create Position"}</h3>
              <button className="admin-positions-modal-close" onClick={() => setShowModal(false)}>
                Close
              </button>
            </div>
            <form onSubmit={handleSubmit} className="admin-positions-modal-form">
              <div className="admin-positions-form-group">
                <label>Position Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Chairman, Secretary, Treasurer"
                  required
                />
              </div>
              <div className="admin-positions-form-group">
                <label>Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  placeholder="Describe the responsibilities of this position"
                />
              </div>
              <div className="admin-positions-form-group">
                <label>Status</label>
                <select
                  value={formData.isActive ? "active" : "inactive"}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.value === "active" })}
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
              <div className="admin-positions-modal-actions">
                <button
                  type="button"
                  className="admin-positions-modal-cancel"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="admin-positions-modal-submit"
                  disabled={submitting}
                >
                  {submitting ? "Saving..." : editingPosition ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showAssignModal && selectedPosition && (
        <div className="admin-positions-modal-overlay" onClick={() => setShowAssignModal(false)}>
          <div className="admin-positions-modal admin-positions-modal-assign" onClick={(e) => e.stopPropagation()}>
            <div className="admin-positions-modal-header">
              <h3>Assign Member to {selectedPosition.name}</h3>
              <button className="admin-positions-modal-close" onClick={() => setShowAssignModal(false)}>
                Close
              </button>
            </div>
            <div className="admin-positions-modal-body">
              <div className="admin-positions-form-group">
                <label>Select Member</label>
                <select
                  value={selectedMemberId || ""}
                  onChange={(e) => setSelectedMemberId(parseInt(e.target.value))}
                  className="admin-positions-select"
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
                <p className="admin-positions-no-members">All members are already assigned to positions.</p>
              )}
            </div>
            <div className="admin-positions-modal-actions">
              <button
                type="button"
                className="admin-positions-modal-cancel"
                onClick={() => setShowAssignModal(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="admin-positions-modal-submit"
                onClick={handleAssignMember}
                disabled={!selectedMemberId || submitting}
              >
                {submitting ? "Assigning..." : "Assign Member"}
              </button>
            </div>
          </div>
        </div>
      )}

      {showPositionMembersModal && selectedPosition && (
        <div className="admin-positions-modal-overlay" onClick={() => setShowPositionMembersModal(false)}>
          <div className="admin-positions-modal admin-positions-modal-members" onClick={(e) => e.stopPropagation()}>
            <div className="admin-positions-modal-header">
              <h3>{selectedPosition.name} - Members</h3>
              <button className="admin-positions-modal-close" onClick={() => setShowPositionMembersModal(false)}>
                Close
              </button>
            </div>
            <div className="admin-positions-modal-body">
              {getLeadersForPosition(selectedPosition.positionId).length > 0 ? (
                <div className="admin-positions-members-list">
                  {getLeadersForPosition(selectedPosition.positionId).map((leader) => (
                    <div key={leader.leaderId} className="admin-positions-member-item">
                      <div className="admin-positions-member-info">
                        <span className="admin-positions-member-name">{getMemberName(leader.memberId)}</span>
                        <span className="admin-positions-member-email">{getMemberEmail(leader.memberId)}</span>
                      </div>
                      {isAdmin && (
                        <button
                          className="admin-positions-btn-remove"
                          onClick={() => {
                            setRemoveLeaderId(leader.leaderId);
                            setShowRemoveModal(true);
                          }}
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="admin-positions-no-members">No members assigned to this position.</p>
              )}
            </div>
          </div>
        </div>
      )}

      {showDeleteModal && (
        <div className="admin-positions-modal-overlay" onClick={() => setShowDeleteModal(false)}>
          <div className="admin-positions-modal admin-positions-modal-small" onClick={(e) => e.stopPropagation()}>
            <div className="admin-positions-modal-header">
              <h3>Delete Position</h3>
              <button className="admin-positions-modal-close" onClick={() => setShowDeleteModal(false)}>
                Close
              </button>
            </div>
            <div className="admin-positions-modal-body">
              <p>Are you sure you want to delete this position?</p>
              <p className="admin-positions-modal-warning">This action cannot be undone.</p>
            </div>
            <div className="admin-positions-modal-actions">
              <button className="admin-positions-modal-cancel" onClick={() => setShowDeleteModal(false)}>
                Cancel
              </button>
              <button className="admin-positions-modal-danger" onClick={handleDelete}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {showRemoveModal && (
        <div className="admin-positions-modal-overlay" onClick={() => setShowRemoveModal(false)}>
          <div className="admin-positions-modal admin-positions-modal-small" onClick={(e) => e.stopPropagation()}>
            <div className="admin-positions-modal-header">
              <h3>Remove Member</h3>
              <button className="admin-positions-modal-close" onClick={() => setShowRemoveModal(false)}>
                Close
              </button>
            </div>
            <div className="admin-positions-modal-body">
              <p>Are you sure you want to remove this member from the position?</p>
              <p className="admin-positions-modal-warning">This action cannot be undone.</p>
            </div>
            <div className="admin-positions-modal-actions">
              <button className="admin-positions-modal-cancel" onClick={() => setShowRemoveModal(false)}>
                Cancel
              </button>
              <button className="admin-positions-modal-danger" onClick={handleRemoveFromPosition}>
                Remove
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}