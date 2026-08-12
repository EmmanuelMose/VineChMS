import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { FiSearch, FiX, FiUserPlus, FiEdit2, FiTrash2, FiCheckCircle, FiXCircle, FiAward, FiRefreshCw } from "react-icons/fi";
import { fetchMembers, deleteMember, updateMember, upgradeMemberRole, type Member } from "../../../../Features/members/membersAPI";
import { refreshUser } from "../../../../Features/userSlice";
import CreateMember from "./CreateMember";
import UpdateMember from "./UpdateMember";
import "./Members.css";

export default function Members() {
  const token = useSelector((state: any) => state.user.token);
  const userRole = useSelector((state: any) => state.user.user?.role);
  const dispatch = useDispatch();
  
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
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [upgradeTargetId, setUpgradeTargetId] = useState<number | null>(null);
  const [selectedRole, setSelectedRole] = useState("pastor");
  const [upgrading, setUpgrading] = useState(false);
  const [upgradeMessage, setUpgradeMessage] = useState("");
  const [upgradeSuccess, setUpgradeSuccess] = useState(false);

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

  const handleUpgradeClick = (memberId: number) => {
    setUpgradeTargetId(memberId);
    setSelectedRole("pastor");
    setUpgradeMessage("");
    setUpgradeSuccess(false);
    setShowUpgradeModal(true);
  };

  const confirmUpgrade = async () => {
    if (!upgradeTargetId) return;
    
    setUpgrading(true);
    setUpgradeMessage("");
    setUpgradeSuccess(false);
    
    try {
      const result = await upgradeMemberRole(upgradeTargetId, selectedRole, token);
      await loadMembers();
      
      if (result.newToken && result.updatedUser) {
        dispatch(refreshUser({
          user: result.updatedUser,
          token: result.newToken
        }));
        
        setUpgradeSuccess(true);
        setUpgradeMessage(`✅ ${result.updatedUser.fullName} upgraded to ${selectedRole} successfully! Your session has been refreshed.`);
        
        setTimeout(() => {
          setShowUpgradeModal(false);
          setUpgradeTargetId(null);
          setUpgradeMessage("");
          setUpgradeSuccess(false);
        }, 3000);
      } else {
        setUpgradeMessage(`✅ Member upgraded to ${selectedRole} successfully!\n\n⚠️ Please log out and log back in to see the changes.`);
      }
      
    } catch (error: any) {
      console.error("Failed to upgrade member:", error);
      setUpgradeMessage(`❌ Failed to upgrade member: ${error.response?.data?.message || error.message}`);
    } finally {
      setUpgrading(false);
    }
  };

  const handleSuccess = () => {
    loadMembers();
    setCreateModalOpen(false);
    setUpdateModalOpen(false);
    setSelectedMember(null);
  };

  const canUpgrade = userRole === "church_admin" || userRole === "super_admin";

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

      {showUpgradeModal && (
        <div className="members-modal-overlay" onClick={() => setShowUpgradeModal(false)}>
          <div className="members-modal" onClick={(e) => e.stopPropagation()}>
            <div className="members-modal-header">
              <h3>Upgrade Member Role</h3>
              <button onClick={() => setShowUpgradeModal(false)} className="members-modal-close">
                <FiX size={20} />
              </button>
            </div>
            <div className="members-modal-body">
              <p>Select a new role for this member:</p>
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="members-upgrade-select"
                disabled={upgrading}
              >
                <option value="pastor">Pastor</option>
                <option value="elder">Elder</option>
                <option value="treasurer">Treasurer</option>
                <option value="secretary">Secretary</option>
                <option value="church_member">Church Member (Remove Special Role)</option>
              </select>
              
              {upgradeMessage && (
                <div style={{ 
                  marginTop: "1rem", 
                  padding: "1rem", 
                  borderRadius: "8px",
                  background: upgradeSuccess ? "#f0fdf4" : upgradeMessage.includes("❌") ? "#fef2f2" : "#fef3c7",
                  border: upgradeSuccess ? "1px solid #bbf7d0" : upgradeMessage.includes("❌") ? "1px solid #fecaca" : "1px solid #fcd34d"
                }}>
                  <p style={{ margin: 0, fontSize: "0.9rem", color: upgradeSuccess ? "#16a34a" : upgradeMessage.includes("❌") ? "#dc2626" : "#92400e", whiteSpace: "pre-line" }}>
                    {upgradeMessage}
                  </p>
                  {upgradeSuccess && (
                    <p style={{ margin: "0.5rem 0 0 0", fontSize: "0.8rem", color: "#16a34a" }}>
                      <FiRefreshCw style={{ display: "inline", marginRight: "0.3rem" }} />
                      Session refreshed automatically!
                    </p>
                  )}
                </div>
              )}
            </div>
            <div className="members-modal-actions">
              <button onClick={() => setShowUpgradeModal(false)} className="members-btn-cancel" disabled={upgrading}>
                Cancel
              </button>
              <button onClick={confirmUpgrade} className="members-btn-success" disabled={upgrading || upgradeSuccess}>
                {upgrading ? "Upgrading..." : upgradeSuccess ? "Done ✓" : "Upgrade"}
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
                    {canUpgrade && member.role !== "church_admin" && member.role !== "super_admin" && (
                      <button 
                        onClick={() => handleUpgradeClick(member.memberId)} 
                        className="members-action-btn members-action-upgrade" 
                        title="Upgrade Role"
                      >
                        <FiAward size={16} />
                      </button>
                    )}
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