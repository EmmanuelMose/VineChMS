import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { FiSearch, FiX, FiUserPlus, FiEdit2, FiTrash2, FiCheckCircle, FiXCircle } from "react-icons/fi";
import { fetchMembers, deleteMember, updateMember, type Member } from "../../../../Features/members/membersAPI";
import CreateMember from "./CreateMember";
import UpdateMember from "./UpdateMember";
import "./Members.css";

export default function Members() {
  const token = useSelector((state: any) => state.user.token);
  
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [statusTarget, setStatusTarget] = useState<{ id: number; currentStatus: boolean } | null>(null);

  useEffect(() => {
    loadMembers();
  }, []);

  const loadMembers = async () => {
    try {
      setLoading(true);
      const data = await fetchMembers(token);
      setMembers(data);
    } catch (error) {
      console.error("Failed to load members:", error);
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
        await deleteMember(deleteTargetId, token);
        await loadMembers();
        setShowDeleteModal(false);
        setDeleteTargetId(null);
      } catch (error) {
        console.error("Failed to delete member:", error);
      }
    }
  };

  const handleToggleStatus = (member: Member) => {
    setStatusTarget({ id: member.memberId, currentStatus: member.isActive });
    setShowStatusModal(true);
  };

  const confirmStatusToggle = async () => {
    if (statusTarget) {
      try {
        await updateMember(statusTarget.id, { isActive: !statusTarget.currentStatus }, token);
        await loadMembers();
        setShowStatusModal(false);
        setStatusTarget(null);
      } catch (error) {
        console.error("Failed to update member status:", error);
      }
    }
  };

  const handleEdit = (member: Member) => {
    setSelectedMember(member);
    setUpdateModalOpen(true);
  };

  const handleSuccess = () => {
    loadMembers();
    setCreateModalOpen(false);
    setUpdateModalOpen(false);
    setSelectedMember(null);
  };

  const filteredMembers = members.filter(member =>
    member.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (member.membershipNumber && member.membershipNumber.includes(searchTerm))
  );

  if (loading) {
    return (
      <div className="members-loading">
        <div className="members-loading-spinner"></div>
        <p>Loading members...</p>
      </div>
    );
  }

  return (
    <div className="members-page">
      {showDeleteModal && (
        <div className="members-modal-overlay" onClick={() => setShowDeleteModal(false)}>
          <div className="members-modal members-modal-confirm" onClick={(e) => e.stopPropagation()}>
            <div className="members-modal-header">
              <h3>Delete Member</h3>
              <button onClick={() => setShowDeleteModal(false)} className="members-modal-close">
                <FiX size={20} />
              </button>
            </div>
            <div className="members-modal-body">
              <p>Are you sure you want to permanently delete this member?</p>
              <p className="members-modal-warning">This action cannot be undone. All associated data will be removed.</p>
            </div>
            <div className="members-modal-actions">
              <button onClick={() => setShowDeleteModal(false)} className="members-btn-cancel">
                Cancel
              </button>
              <button onClick={confirmDelete} className="members-btn-danger">
                Delete Permanently
              </button>
            </div>
          </div>
        </div>
      )}

      {showStatusModal && (
        <div className="members-modal-overlay" onClick={() => setShowStatusModal(false)}>
          <div className="members-modal members-modal-confirm" onClick={(e) => e.stopPropagation()}>
            <div className="members-modal-header">
              <h3>{statusTarget?.currentStatus ? "Deactivate" : "Activate"} Member</h3>
              <button onClick={() => setShowStatusModal(false)} className="members-modal-close">
                <FiX size={20} />
              </button>
            </div>
            <div className="members-modal-body">
              <p>Are you sure you want to {statusTarget?.currentStatus ? "deactivate" : "activate"} this member?</p>
              <p className="members-modal-info">
                {statusTarget?.currentStatus 
                  ? "Deactivated members will not be able to access the system until reactivated."
                  : "Activated members will have full access to the system."}
              </p>
            </div>
            <div className="members-modal-actions">
              <button onClick={() => setShowStatusModal(false)} className="members-btn-cancel">
                Cancel
              </button>
              <button onClick={confirmStatusToggle} className={`members-btn-${statusTarget?.currentStatus ? "warning" : "success"}`}>
                {statusTarget?.currentStatus ? "Deactivate" : "Activate"}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="members-header">
        <div>
          <h2 className="members-title">Members</h2>
          <p className="members-subtitle">Manage your church members</p>
        </div>
        <div className="members-actions">
          <button onClick={() => setCreateModalOpen(true)} className="members-btn-primary">
            <FiUserPlus size={18} />
            Add Member
          </button>
        </div>
      </div>

      <div className="members-toolbar">
        <div className="members-search">
          <FiSearch className="members-search-icon" />
          <input
            type="text"
            placeholder="Search members..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="members-search-input"
          />
          {searchTerm && (
            <button onClick={() => setSearchTerm("")} className="members-search-clear">
              <FiX size={16} />
            </button>
          )}
        </div>
        <div className="members-stats">
          <span>Total: {members.length}</span>
          <span>Active: {members.filter(m => m.isActive).length}</span>
          <span>Inactive: {members.filter(m => !m.isActive).length}</span>
        </div>
      </div>

      <div className="members-table-wrapper">
        <table className="members-table">
          <thead>
            <tr>
              <th>Member</th>
              <th>Email</th>
              <th>Membership #</th>
              <th>Role</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredMembers.map((member) => (
              <tr key={member.memberId}>
                <td>
                  <div className="members-cell-member">
                    <div className="members-avatar">
                      {member.fullName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="members-cell-name">{member.fullName}</div>
                      {member.isLeader && (
                        <span className="members-badge-leader">Leader</span>
                      )}
                    </div>
                  </div>
                </td>
                <td>{member.email}</td>
                <td>{member.membershipNumber || "N/A"}</td>
                <td>
                  <span className={`members-role-badge role-${member.role}`}>
                    {member.role.replace("_", " ")}
                  </span>
                </td>
                <td>
                  <span className={`members-status-badge ${member.isActive ? "status-active" : "status-inactive"}`}>
                    {member.isActive ? "Active" : "Inactive"}
                  </span>
                </td>
                <td>
                  <div className="members-actions-cell">
                    <button onClick={() => handleEdit(member)} className="members-action-btn members-action-edit" title="Edit">
                      <FiEdit2 size={16} />
                    </button>
                    <button onClick={() => handleToggleStatus(member)} className={`members-action-btn ${member.isActive ? "members-action-warning" : "members-action-success"}`} title={member.isActive ? "Deactivate" : "Activate"}>
                      {member.isActive ? <FiXCircle size={16} /> : <FiCheckCircle size={16} />}
                    </button>
                    <button onClick={() => handleDeleteClick(member.memberId)} className="members-action-btn members-action-delete" title="Delete Permanently">
                      <FiTrash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filteredMembers.length === 0 && (
              <tr>
                <td colSpan={6} className="members-empty">
                  No members found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <CreateMember
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSuccess={handleSuccess}
      />

      {selectedMember && (
        <UpdateMember
          isOpen={updateModalOpen}
          onClose={() => {
            setUpdateModalOpen(false);
            setSelectedMember(null);
          }}
          onSuccess={handleSuccess}
          member={selectedMember}
        />
      )}
    </div>
  );
}