import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { fetchGroups, fetchGroupMembers, removeMemberFromGroup, fetchMemberGroups, requestToJoinGroup, fetchMyJoinRequests, type Group, type GroupMember } from "../../../../Features/groups/groupsAPI";
import { fetchMemberByUserId } from "../../../../Features/members/membersAPI";
import "./Groups.css";

export default function Groups() {
  const token = useSelector((state: any) => state.user.token);
  const churchId = useSelector((state: any) => state.user.user?.churchId);
  const userId = useSelector((state: any) => state.user.user?.userId);

  const [groups, setGroups] = useState<Group[]>([]);
  const [memberGroups, setMemberGroups] = useState<number[]>([]);
  const [pendingRequests, setPendingRequests] = useState<number[]>([]);
  const [memberId, setMemberId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredGroups, setFilteredGroups] = useState<Group[]>([]);
  const [processingId, setProcessingId] = useState<number | null>(null);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [groupMembers, setGroupMembers] = useState<GroupMember[]>([]);
  const [showMembersModal, setShowMembersModal] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [requestGroupId, setRequestGroupId] = useState<number | null>(null);
  const [requestMessage, setRequestMessage] = useState("");

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
    if (memberId) {
      loadData();
    }
  }, [memberId]);

  useEffect(() => {
    filterGroups();
  }, [groups, searchTerm]);

  const loadData = async () => {
    if (!memberId || !token) return;
    try {
      setLoading(true);
      
      const allGroups = await fetchGroups(token);
      const memberGroupsData = await fetchMemberGroups(memberId, token);
      
      let myRequests: any[] = [];
      try {
        myRequests = await fetchMyJoinRequests(token);
      } catch (error: any) {
        if (error.response && error.response.status === 404) {
          console.warn("fetchMyJoinRequests endpoint not found, using empty list.");
        } else {
          console.error("Failed to fetch my join requests:", error);
        }
        myRequests = [];
      }

      const churchGroups = allGroups.filter((g) => g.churchId === churchId);
      setGroups(churchGroups);
      const memberGroupIds = memberGroupsData.map((mg) => mg.groupId);
      setMemberGroups(memberGroupIds);
      const pendingGroupIds = myRequests.filter((r) => r.status === 'pending').map((r) => r.groupId);
      setPendingRequests(pendingGroupIds);
    } catch (error) {
      console.error("Failed to load groups:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterGroups = () => {
    let filtered = [...groups];
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (g) =>
          g.name.toLowerCase().includes(term) ||
          (g.description || "").toLowerCase().includes(term)
      );
    }
    setFilteredGroups(filtered);
  };

  const isMember = (groupId: number) => {
    return memberGroups.includes(groupId);
  };

  const isPending = (groupId: number) => {
    return pendingRequests.includes(groupId);
  };

  const handleRequestJoin = (groupId: number) => {
    setRequestGroupId(groupId);
    setShowRequestModal(true);
    setRequestMessage("");
  };

  const submitRequest = async () => {
    if (!requestGroupId || !memberId) return;
    setProcessingId(requestGroupId);
    try {
      await requestToJoinGroup({ groupId: requestGroupId, memberId: memberId, message: requestMessage }, token);
      alert("Your request to join has been sent to the group leader.");
      try {
        const updatedRequests = await fetchMyJoinRequests(token);
        const pendingGroupIds = updatedRequests.filter((r) => r.status === 'pending').map((r) => r.groupId);
        setPendingRequests(pendingGroupIds);
      } catch (e) {
        console.warn("Could not refresh pending requests, but request was sent.");
      }
      setShowRequestModal(false);
      setRequestGroupId(null);
      setRequestMessage("");
    } catch (error: any) {
      console.error("Failed to send request:", error);
      const message = error.response?.data?.message || "Failed to send request. Please try again.";
      alert(message);
    } finally {
      setProcessingId(null);
    }
  };

  const handleLeave = async (groupId: number) => {
    if (!window.confirm("Are you sure you want to leave this group?")) return;
    setProcessingId(groupId);
    try {
      const memberGroupsData = await fetchMemberGroups(memberId!, token);
      const membership = memberGroupsData.find((mg) => mg.groupId === groupId);
      if (membership) {
        await removeMemberFromGroup(membership.groupMemberId, token);
        await loadData();
      } else {
        alert("You are not a member of this group.");
      }
    } catch (error) {
      console.error("Failed to leave group:", error);
      alert("Failed to leave group. Please try again.");
    } finally {
      setProcessingId(null);
    }
  };

  const handleViewMembers = async (group: Group) => {
    setSelectedGroup(group);
    setShowMembersModal(true);
    setModalLoading(true);
    try {
      const members = await fetchGroupMembers(group.groupId, token);
      setGroupMembers(members);
    } catch (error) {
      console.error("Failed to load group members:", error);
      alert("Failed to load group members.");
    } finally {
      setModalLoading(false);
    }
  };

  const closeModal = () => {
    setShowMembersModal(false);
    setSelectedGroup(null);
    setGroupMembers([]);
  };

  if (loading) {
    return (
      <div className="member-groups-loading">
        <div className="member-groups-loading-spinner"></div>
        <p>Loading groups...</p>
      </div>
    );
  }

  return (
    <div className="member-groups-page">
      <div className="member-groups-header">
        <div>
          <h2 className="member-groups-title">Groups</h2>
          <p className="member-groups-subtitle">View your groups and request to join others</p>
        </div>
      </div>

      <div className="member-groups-search">
        <input
          type="text"
          placeholder="Search groups..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="member-groups-search-input"
        />
      </div>

      <div className="member-groups-grid">
        {filteredGroups.length > 0 ? (
          filteredGroups.map((group) => {
            const inGroup = isMember(group.groupId);
            const pending = isPending(group.groupId);
            const isProcessing = processingId === group.groupId;
            return (
              <div key={group.groupId} className="member-groups-card">
                <div className="member-groups-card-header">
                  <h3 className="member-groups-card-title">{group.name}</h3>
                  {inGroup && (
                    <span className="member-groups-badge-member">Member</span>
                  )}
                  {pending && !inGroup && (
                    <span className="member-groups-badge-pending">Requested</span>
                  )}
                </div>
                {group.description && (
                  <p className="member-groups-card-description">{group.description}</p>
                )}
                <div className="member-groups-card-meta">
                  {group.type && <span>Type: {group.type}</span>}
                  {group.meetingDay !== undefined && (
                    <span>Day: {["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"][group.meetingDay]}</span>
                  )}
                  {group.location && <span>Location: {group.location}</span>}
                </div>
                <div className="member-groups-card-actions">
                  {inGroup ? (
                    <>
                      <button
                        className="member-groups-btn-view"
                        onClick={() => handleViewMembers(group)}
                      >
                        View Members
                      </button>
                      <button
                        className="member-groups-btn-leave"
                        onClick={() => handleLeave(group.groupId)}
                        disabled={isProcessing}
                      >
                        {isProcessing ? "Processing..." : "Leave"}
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        className="member-groups-btn-view"
                        onClick={() => handleViewMembers(group)}
                      >
                        View Members
                      </button>
                      <button
                        className="member-groups-btn-request"
                        onClick={() => handleRequestJoin(group.groupId)}
                        disabled={isProcessing || pending}
                      >
                        {pending ? "Request Sent" : "Request to Join"}
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <div className="member-groups-empty">
            <p>No groups found</p>
            <span>Try adjusting your search</span>
          </div>
        )}
      </div>

      {showMembersModal && selectedGroup && (
        <div className="member-groups-modal-overlay" onClick={closeModal}>
          <div className="member-groups-modal" onClick={(e) => e.stopPropagation()}>
            <div className="member-groups-modal-header">
              <h3>{selectedGroup.name} - Members</h3>
              <button className="member-groups-modal-close" onClick={closeModal}>
                Close
              </button>
            </div>
            <div className="member-groups-modal-body">
              {modalLoading ? (
                <p>Loading members...</p>
              ) : groupMembers.length > 0 ? (
                <ul className="member-groups-member-list">
                  {groupMembers.map((gm) => (
                    <li key={gm.groupMemberId} className="member-groups-member-item">
                      <span className="member-groups-member-name">{gm.fullName || "Unknown"}</span>
                      <span className="member-groups-member-role">{gm.role || "member"}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No members found for this group.</p>
              )}
            </div>
          </div>
        </div>
      )}

      {showRequestModal && requestGroupId && (
        <div className="member-groups-modal-overlay" onClick={() => setShowRequestModal(false)}>
          <div className="member-groups-modal" onClick={(e) => e.stopPropagation()}>
            <div className="member-groups-modal-header">
              <h3>Request to Join</h3>
              <button className="member-groups-modal-close" onClick={() => setShowRequestModal(false)}>
                Close
              </button>
            </div>
            <div className="member-groups-modal-body">
              <p>Send a request to the group leader to join this group.</p>
              <textarea
                placeholder="Optional message to the leader..."
                value={requestMessage}
                onChange={(e) => setRequestMessage(e.target.value)}
                rows={3}
                className="member-groups-request-textarea"
              />
            </div>
            <div className="member-groups-modal-actions">
              <button
                className="member-groups-modal-cancel"
                onClick={() => setShowRequestModal(false)}
              >
                Cancel
              </button>
              <button
                className="member-groups-modal-submit"
                onClick={submitRequest}
                disabled={processingId === requestGroupId}
              >
                {processingId === requestGroupId ? "Sending..." : "Send Request"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}