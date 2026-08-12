import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { FiArrowLeft, FiX, FiUserPlus, FiUserX, FiCheckCircle, FiXCircle } from "react-icons/fi";
import { fetchGroupMembers, addMemberToGroup, updateGroupMember, removeMemberFromGroup, type GroupMember } from "../../../../Features/groups/groupsAPI";
import { type Member } from "../../../../Features/members/membersAPI";
import "./GroupMembers.css";

interface GroupMembersProps {
  groupId: number;
  groupName: string;
  onBack: () => void;
  token: string;
  members: Member[];
  onSuccess: () => void;
}

export default function GroupMembers({ groupId, groupName, onBack, token, members, onSuccess }: GroupMembersProps) {
  const churchId = useSelector((state: any) => state.user.user?.churchId);
  const [groupMembers, setGroupMembers] = useState<GroupMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedMemberId, setSelectedMemberId] = useState("");
  const [selectedRole, setSelectedRole] = useState("member");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    loadGroupMembers();
  }, [groupId]);

  const loadGroupMembers = async () => {
    try {
      setLoading(true);
      const data = await fetchGroupMembers(groupId, token);
      setGroupMembers(data);
    } catch (error) {
      console.error("Failed to load group members:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSaving(true);

    try {
      await addMemberToGroup({
        groupId: groupId,
        memberId: parseInt(selectedMemberId),
        role: selectedRole,
        isActive: true,
      }, token);
      setShowAddModal(false);
      setSelectedMemberId("");
      setSelectedRole("member");
      await loadGroupMembers();
      onSuccess();
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to add member");
    } finally {
      setSaving(false);
    }
  };

  const handleRemoveMember = async (groupMemberId: number) => {
    if (window.confirm("Are you sure you want to remove this member from the group?")) {
      try {
        await removeMemberFromGroup(groupMemberId, token);
        await loadGroupMembers();
        onSuccess();
      } catch (error) {
        console.error("Failed to remove member:", error);
      }
    }
  };

  const handleToggleActive = async (groupMemberId: number, currentStatus: boolean) => {
    try {
      await updateGroupMember(groupMemberId, { isActive: !currentStatus }, token);
      await loadGroupMembers();
      onSuccess();
    } catch (error) {
      console.error("Failed to update member status:", error);
    }
  };

  const getMemberName = (memberId: number) => {
    const member = members.find(m => m.memberId === memberId);
    return member ? member.fullName : "Unknown";
  };

  const getMemberEmail = (memberId: number) => {
    const member = members.find(m => m.memberId === memberId);
    return member ? member.email : "";
  };

  const availableMembers = members.filter(m => 
    m.isActive && 
    m.churchId === churchId && 
    !groupMembers.some(gm => gm.memberId === m.memberId)
  );

  if (loading) {
    return (
      <div className="group-members-loading">
        <div className="group-members-loading-spinner"></div>
        <p>Loading members...</p>
      </div>
    );
  }

  return (
    <div className="group-members-page">
      <div className="group-members-header">
        <button onClick={onBack} className="group-members-back-btn">
          <FiArrowLeft size={18} />
          Back to Groups
        </button>
        <div className="group-members-title-section">
          <h2 className="group-members-title">{groupName}</h2>
          <p className="group-members-count">{groupMembers.length} members</p>
        </div>
        <button onClick={() => setShowAddModal(true)} className="group-members-add-btn">
          <FiUserPlus size={16} />
          Add Member
        </button>
      </div>

      <div className="group-members-table-wrapper">
        <table className="group-members-table">
          <thead>
            <tr>
              <th>Member</th>
              <th>Email</th>
              <th>Role</th>
              <th>Joined</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {groupMembers.map((gm) => (
              <tr key={gm.groupMemberId}>
                <td>
                  <div className="group-members-cell-member">
                    <div className="group-members-avatar">
                      {getMemberName(gm.memberId).charAt(0).toUpperCase()}
                    </div>
                    <span>{getMemberName(gm.memberId)}</span>
                  </div>
                </td>
                <td>{getMemberEmail(gm.memberId)}</td>
                <td>
                  <span className="group-members-role-badge">
                    {gm.role || "member"}
                  </span>
                </td>
                <td>{new Date(gm.joinedAt).toLocaleDateString()}</td>
                <td>
                  <span className={`group-members-status-badge ${gm.isActive ? "status-active" : "status-inactive"}`}>
                    {gm.isActive ? "Active" : "Inactive"}
                  </span>
                </td>
                <td>
                  <div className="group-members-actions-cell">
                    <button 
                      onClick={() => handleToggleActive(gm.groupMemberId, gm.isActive)} 
                      className={`group-members-action-btn ${gm.isActive ? "group-members-action-deactivate" : "group-members-action-activate"}`}
                      title={gm.isActive ? "Deactivate" : "Activate"}
                    >
                      {gm.isActive ? <FiXCircle size={16} /> : <FiCheckCircle size={16} />}
                    </button>
                    <button 
                      onClick={() => handleRemoveMember(gm.groupMemberId)} 
                      className="group-members-action-btn group-members-action-remove"
                      title="Remove from group"
                    >
                      <FiUserX size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {groupMembers.length === 0 && (
              <tr>
                <td colSpan={6} className="group-members-empty">
                  No members in this group
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showAddModal && (
        <div className="group-members-modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="group-members-modal" onClick={(e) => e.stopPropagation()}>
            <div className="group-members-modal-header">
              <h3>Add Member to Group</h3>
              <button onClick={() => setShowAddModal(false)} className="group-members-modal-close">
                <FiX size={20} />
              </button>
            </div>
            <form onSubmit={handleAddMember} className="group-members-modal-form">
              <div className="group-members-modal-group">
                <label>Member *</label>
                <select
                  value={selectedMemberId}
                  onChange={(e) => setSelectedMemberId(e.target.value)}
                  required
                >
                  <option value="">Select a member</option>
                  {availableMembers.map((member) => (
                    <option key={member.memberId} value={member.memberId}>
                      {member.fullName} ({member.email})
                    </option>
                  ))}
                </select>
              </div>
              <div className="group-members-modal-group">
                <label>Role</label>
                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                >
                  <option value="member">Member</option>
                  <option value="leader">Leader</option>
                  <option value="facilitator">Facilitator</option>
                </select>
              </div>
              {error && <div className="group-members-modal-error">{error}</div>}
              <div className="group-members-modal-actions">
                <button type="button" onClick={() => setShowAddModal(false)} className="group-members-modal-cancel">
                  Cancel
                </button>
                <button type="submit" className="group-members-modal-save" disabled={saving}>
                  {saving ? "Adding..." : "Add Member"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}