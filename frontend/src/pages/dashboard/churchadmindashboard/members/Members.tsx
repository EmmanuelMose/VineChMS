import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { FiSearch, FiX, FiUserPlus } from "react-icons/fi";
import { fetchMembers, deleteMember, type Member } from "../../../../Features/members/membersAPI";
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

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this member?")) {
      try {
        await deleteMember(id, token);
        await loadMembers();
      } catch (error) {
        console.error("Failed to delete member:", error);
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
                    <button onClick={() => handleEdit(member)} className="members-action-btn members-action-edit">
                      Edit
                    </button>
                    <button onClick={() => handleDelete(member.memberId)} className="members-action-btn members-action-delete">
                      Delete
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