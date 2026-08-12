import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { FiSearch, FiX, FiPlus, FiEdit2, FiTrash2, FiUsers, FiUser, FiCalendar, FiMapPin } from "react-icons/fi";
import { fetchGroups, deleteGroup, type Group } from "../../../../Features/groups/groupsAPI";
import { fetchMembers, type Member } from "../../../../Features/members/membersAPI";
import CreateGroup from "./CreateGroup";
import UpdateGroup from "./UpdateGroup";
import GroupMembers from "./GroupMember";
import "./Groups.css";

export default function Groups() {
  const token = useSelector((state: any) => state.user.token);
  const churchId = useSelector((state: any) => state.user.user?.churchId);
  
  const [groups, setGroups] = useState<Group[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);
  const [showMembers, setShowMembers] = useState(false);
  const [membersGroupId, setMembersGroupId] = useState<number | null>(null);
  const [membersGroupName, setMembersGroupName] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [groupsData, membersData] = await Promise.all([
        fetchGroups(token),
        fetchMembers(token),
      ]);
      const filteredGroups = groupsData.filter(g => g.churchId === churchId);
      setGroups(filteredGroups);
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
        await deleteGroup(deleteTargetId, token);
        await loadData();
        setShowDeleteModal(false);
        setDeleteTargetId(null);
      } catch (error) {
        console.error("Failed to delete group:", error);
      }
    }
  };

  const handleEdit = (group: Group) => {
    setSelectedGroup(group);
    setUpdateModalOpen(true);
  };

  const handleViewMembers = (groupId: number, groupName: string) => {
    setMembersGroupId(groupId);
    setMembersGroupName(groupName);
    setShowMembers(true);
  };

  const handleSuccess = () => {
    loadData();
    setCreateModalOpen(false);
    setUpdateModalOpen(false);
    setSelectedGroup(null);
  };

  const getLeaderName = (leaderId?: number) => {
    if (!leaderId) return "No leader";
    const member = members.find(m => m.memberId === leaderId);
    return member ? member.fullName : "Unknown";
  };

  const getDayName = (day?: number) => {
    if (day === undefined) return "Not set";
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    return days[day] || "Unknown";
  };

  const filteredGroups = groups.filter(group => {
    const matchesSearch = 
      group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (group.description || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      getLeaderName(group.leaderId).toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = filterType === "all" || group.type === filterType;
    const matchesStatus = filterStatus === "all" || (filterStatus === "active" && group.isActive) || (filterStatus === "inactive" && !group.isActive);
    
    return matchesSearch && matchesType && matchesStatus;
  });

  const stats = {
    total: groups.length,
    active: groups.filter(g => g.isActive).length,
    inactive: groups.filter(g => !g.isActive).length,
    types: groups.reduce((acc: Record<string, number>, g) => {
      const type = g.type || "uncategorized";
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {}),
  };

  if (loading) {
    return (
      <div className="groups-loading">
        <div className="groups-loading-spinner"></div>
        <p>Loading groups...</p>
      </div>
    );
  }

  if (showMembers && membersGroupId) {
    return (
      <GroupMembers
        groupId={membersGroupId}
        groupName={membersGroupName}
        onBack={() => setShowMembers(false)}
        token={token}
        members={members}
        onSuccess={loadData}
      />
    );
  }

  return (
    <div className="groups-page">
      {showDeleteModal && (
        <div className="groups-modal-overlay" onClick={() => setShowDeleteModal(false)}>
          <div className="groups-modal groups-modal-confirm" onClick={(e) => e.stopPropagation()}>
            <div className="groups-modal-header">
              <h3>Delete Group</h3>
              <button onClick={() => setShowDeleteModal(false)} className="groups-modal-close">
                <FiX size={20} />
              </button>
            </div>
            <div className="groups-modal-body">
              <p>Are you sure you want to permanently delete this group?</p>
              <p className="groups-modal-warning">This action cannot be undone. All member associations will be removed.</p>
            </div>
            <div className="groups-modal-actions">
              <button onClick={() => setShowDeleteModal(false)} className="groups-btn-cancel">
                Cancel
              </button>
              <button onClick={confirmDelete} className="groups-btn-danger">
                Delete Permanently
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="groups-header">
        <div>
          <h2 className="groups-title">Groups</h2>
          <p className="groups-subtitle">Manage church small groups and fellowships</p>
        </div>
        <div className="groups-actions">
          <button onClick={() => setCreateModalOpen(true)} className="groups-btn-primary">
            <FiPlus size={16} />
            Create Group
          </button>
        </div>
      </div>

      <div className="groups-stats-grid">
        <div className="groups-stat-card stat-total">
          <span className="groups-stat-value">{stats.total}</span>
          <span className="groups-stat-label">Total Groups</span>
        </div>
        <div className="groups-stat-card stat-active">
          <span className="groups-stat-value">{stats.active}</span>
          <span className="groups-stat-label">Active</span>
        </div>
        <div className="groups-stat-card stat-inactive">
          <span className="groups-stat-value">{stats.inactive}</span>
          <span className="groups-stat-label">Inactive</span>
        </div>
        {Object.entries(stats.types).slice(0, 3).map(([type, count]) => (
          <div key={type} className="groups-stat-card stat-type">
            <span className="groups-stat-value">{count}</span>
            <span className="groups-stat-label">{type}</span>
          </div>
        ))}
      </div>

      <div className="groups-toolbar">
        <div className="groups-search">
          <FiSearch className="groups-search-icon" />
          <input
            type="text"
            placeholder="Search groups..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="groups-search-input"
          />
          {searchTerm && (
            <button onClick={() => setSearchTerm("")} className="groups-search-clear">
              <FiX size={16} />
            </button>
          )}
        </div>
        <div className="groups-filters">
          <select 
            value={filterType} 
            onChange={(e) => setFilterType(e.target.value)}
            className="groups-filter-select"
          >
            <option value="all">All Types</option>
            <option value="fellowship">Fellowship</option>
            <option value="youth">Youth</option>
            <option value="bible_study">Bible Study</option>
            <option value="prayer">Prayer</option>
            <option value="worship">Worship</option>
            <option value="service">Service</option>
            <option value="outreach">Outreach</option>
          </select>
          <select 
            value={filterStatus} 
            onChange={(e) => setFilterStatus(e.target.value)}
            className="groups-filter-select"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      <div className="groups-grid">
        {filteredGroups.map((group) => (
          <div key={group.groupId} className="groups-card">
            <div className="groups-card-header">
              <div className="groups-card-title-section">
                <h3 className="groups-card-title">{group.name}</h3>
                <span className={`groups-card-status ${group.isActive ? "status-active" : "status-inactive"}`}>
                  {group.isActive ? "Active" : "Inactive"}
                </span>
              </div>
              <div className="groups-card-actions">
                <button onClick={() => handleViewMembers(group.groupId, group.name)} className="groups-card-btn groups-btn-members" title="View Members">
                  <FiUsers size={14} />
                </button>
                <button onClick={() => handleEdit(group)} className="groups-card-btn groups-btn-edit" title="Edit">
                  <FiEdit2 size={14} />
                </button>
                <button onClick={() => handleDeleteClick(group.groupId)} className="groups-card-btn groups-btn-delete" title="Delete">
                  <FiTrash2 size={14} />
                </button>
              </div>
            </div>
            
            {group.description && (
              <p className="groups-card-description">{group.description}</p>
            )}
            
            <div className="groups-card-details">
              {group.type && (
                <span className="groups-card-type">{group.type}</span>
              )}
              {group.leaderId && (
                <span className="groups-card-detail">
                  <FiUser size={14} />
                  {getLeaderName(group.leaderId)}
                </span>
              )}
              {group.meetingDay !== undefined && (
                <span className="groups-card-detail">
                  <FiCalendar size={14} />
                  {getDayName(group.meetingDay)}
                </span>
              )}
              {group.location && (
                <span className="groups-card-detail">
                  <FiMapPin size={14} />
                  {group.location}
                </span>
              )}
            </div>
          </div>
        ))}
        {filteredGroups.length === 0 && (
          <div className="groups-empty">
            <p>No groups found</p>
          </div>
        )}
      </div>

      <CreateGroup
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSuccess={handleSuccess}
        churchId={churchId}
        members={members}
      />

      {selectedGroup && (
        <UpdateGroup
          isOpen={updateModalOpen}
          onClose={() => {
            setUpdateModalOpen(false);
            setSelectedGroup(null);
          }}
          onSuccess={handleSuccess}
          group={selectedGroup}
          members={members}
        />
      )}
    </div>
  );
}