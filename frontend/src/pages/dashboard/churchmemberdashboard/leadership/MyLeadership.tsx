import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { fetchLeadersByMember, approveLeader, deleteLeader, updateLeader, type Leader } from "../../../../Features/leaders/leadersAPI";
import { fetchPositions, type Position } from "../../../../Features/positions/positionsAPI";
import { fetchMemberByUserId } from "../../../../Features/members/membersAPI";
import "./MyLeadership.css";

export default function MyLeadership() {
  const token = useSelector((state: any) => state.user.token);
  const churchId = useSelector((state: any) => state.user.user?.churchId);
  const userId = useSelector((state: any) => state.user.user?.userId);

  const [leaders, setLeaders] = useState<Leader[]>([]);
  const [positions, setPositions] = useState<Position[]>([]);
  const [memberId, setMemberId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<number | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmAction, setConfirmAction] = useState<{ type: 'approve' | 'decline' | 'deactivate'; leaderId: number } | null>(null);
  const [showDeactivateModal, setShowDeactivateModal] = useState(false);
  const [deactivateTarget, setDeactivateTarget] = useState<Leader | null>(null);

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

  const loadData = async () => {
    if (!memberId || !token) return;
    try {
      setLoading(true);
      const [leadersData, positionsData] = await Promise.all([
        fetchLeadersByMember(memberId, token),
        fetchPositions(token),
      ]);
      const churchPositions = positionsData.filter((p) => p.churchId === churchId);
      setLeaders(leadersData);
      setPositions(churchPositions);
    } catch (error) {
      console.error("Failed to load leadership data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getPositionName = (positionId: number) => {
    const position = positions.find((p) => p.positionId === positionId);
    return position ? position.name : "Unknown Position";
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleApprove = (leader: Leader) => {
    setConfirmAction({ type: 'approve', leaderId: leader.leaderId });
    setShowConfirmModal(true);
  };

  const handleDecline = (leader: Leader) => {
    setConfirmAction({ type: 'decline', leaderId: leader.leaderId });
    setShowConfirmModal(true);
  };

  const handleDeactivate = (leader: Leader) => {
    setDeactivateTarget(leader);
    setShowDeactivateModal(true);
  };

  const confirmActionHandler = async () => {
    if (!confirmAction) return;
    const { type, leaderId } = confirmAction;
    setProcessingId(leaderId);
    try {
      if (type === 'approve') {
        await approveLeader(leaderId, token);
        await loadData();
      } else if (type === 'decline') {
        await deleteLeader(leaderId, token);
        await loadData();
      }
      setShowConfirmModal(false);
      setConfirmAction(null);
    } catch (error: any) {
      console.error("Failed to process leadership action:", error);
      alert(error.response?.data?.message || "Failed to process action. Please try again.");
    } finally {
      setProcessingId(null);
    }
  };

  const confirmDeactivate = async () => {
    if (!deactivateTarget) return;
    setProcessingId(deactivateTarget.leaderId);
    try {
      await updateLeader(deactivateTarget.leaderId, { isActive: false }, token);
      await loadData();
      setShowDeactivateModal(false);
      setDeactivateTarget(null);
    } catch (error: any) {
      console.error("Failed to deactivate leadership:", error);
      alert(error.response?.data?.message || "Failed to deactivate leadership.");
    } finally {
      setProcessingId(null);
    }
  };

  const cancelModal = () => {
    setShowConfirmModal(false);
    setConfirmAction(null);
    setShowDeactivateModal(false);
    setDeactivateTarget(null);
  };

  const activeLeaders = leaders.filter((l) => l.isActive);
  const pendingLeaders = leaders.filter((l) => l.isActive && !l.isApproved);
  const approvedLeaders = leaders.filter((l) => l.isActive && l.isApproved);
  const inactiveLeaders = leaders.filter((l) => !l.isActive);

  if (loading) {
    return (
      <div className="member-leadership-loading">
        <div className="member-leadership-loading-spinner"></div>
        <p>Loading leadership information...</p>
      </div>
    );
  }

  return (
    <div className="member-leadership-page">
      <div className="member-leadership-header">
        <div>
          <h2 className="member-leadership-title">My Leadership</h2>
          <p className="member-leadership-subtitle">View and manage your leadership positions</p>
        </div>
      </div>

      <div className="member-leadership-stats">
        <div className="member-leadership-stat">
          <span className="member-leadership-stat-value">{activeLeaders.length}</span>
          <span className="member-leadership-stat-label">Active Positions</span>
        </div>
        <div className="member-leadership-stat">
          <span className="member-leadership-stat-value">{pendingLeaders.length}</span>
          <span className="member-leadership-stat-label">Pending Approval</span>
        </div>
        <div className="member-leadership-stat">
          <span className="member-leadership-stat-value">{approvedLeaders.length}</span>
          <span className="member-leadership-stat-label">Approved</span>
        </div>
        <div className="member-leadership-stat">
          <span className="member-leadership-stat-value">{inactiveLeaders.length}</span>
          <span className="member-leadership-stat-label">Inactive</span>
        </div>
      </div>

      {leaders.length > 0 ? (
        <div className="member-leadership-list">
          {leaders.map((leader) => {
            const isProcessing = processingId === leader.leaderId;
            const isPending = leader.isActive && !leader.isApproved;
            const isApproved = leader.isActive && leader.isApproved;
            const isInactive = !leader.isActive;
            const positionName = getPositionName(leader.positionId);

            return (
              <div key={leader.leaderId} className="member-leadership-card">
                <div className="member-leadership-card-header">
                  <div>
                    <h3 className="member-leadership-card-title">{positionName}</h3>
                    <span className={`member-leadership-card-status ${isPending ? 'status-pending' : isApproved ? 'status-approved' : 'status-inactive'}`}>
                      {isPending ? 'Pending Approval' : isApproved ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <div className="member-leadership-card-dates">
                    <span>Started: {formatDate(leader.startDate)}</span>
                    {leader.endDate && <span>Ended: {formatDate(leader.endDate)}</span>}
                  </div>
                </div>

                {leader.notes && (
                  <p className="member-leadership-card-notes">{leader.notes}</p>
                )}

                {leader.isApproved && leader.approvedAt && (
                  <div className="member-leadership-card-approved">
                    <span>Approved on: {formatDate(leader.approvedAt)}</span>
                  </div>
                )}

                <div className="member-leadership-card-actions">
                  {isPending && (
                    <>
                      <button
                        className="member-leadership-btn-approve"
                        onClick={() => handleApprove(leader)}
                        disabled={isProcessing}
                      >
                        {isProcessing ? "Processing..." : "Accept Position"}
                      </button>
                      <button
                        className="member-leadership-btn-decline"
                        onClick={() => handleDecline(leader)}
                        disabled={isProcessing}
                      >
                        {isProcessing ? "Processing..." : "Decline"}
                      </button>
                    </>
                  )}
                  {isApproved && (
                    <button
                      className="member-leadership-btn-deactivate"
                      onClick={() => handleDeactivate(leader)}
                      disabled={isProcessing}
                    >
                      {isProcessing ? "Processing..." : "Step Down"}
                    </button>
                  )}
                  {isInactive && (
                    <span className="member-leadership-inactive-label">This position is no longer active</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="member-leadership-empty">
          <p>No leadership positions found</p>
          <span>You have not been assigned any leadership roles yet.</span>
        </div>
      )}

      {showConfirmModal && confirmAction && (
        <div className="member-leadership-modal-overlay" onClick={cancelModal}>
          <div className="member-leadership-modal" onClick={(e) => e.stopPropagation()}>
            <div className="member-leadership-modal-header">
              <h3>{confirmAction.type === 'approve' ? 'Accept Leadership Position' : 'Decline Leadership Position'}</h3>
              <button className="member-leadership-modal-close" onClick={cancelModal}>
                Close
              </button>
            </div>
            <div className="member-leadership-modal-body">
              <p>
                {confirmAction.type === 'approve'
                  ? 'Are you sure you want to accept this leadership position?'
                  : 'Are you sure you want to decline this leadership position?'
                }
              </p>
              <p className="member-leadership-modal-info">
                {confirmAction.type === 'approve'
                  ? 'You will be able to access leadership features and responsibilities.'
                  : 'This action cannot be undone. You will not be able to access leadership features.'
                }
              </p>
            </div>
            <div className="member-leadership-modal-actions">
              <button className="member-leadership-modal-cancel" onClick={cancelModal}>
                Cancel
              </button>
              <button
                className={`member-leadership-modal-${confirmAction.type === 'approve' ? 'approve' : 'decline'}`}
                onClick={confirmActionHandler}
                disabled={processingId !== null}
              >
                {processingId ? "Processing..." : confirmAction.type === 'approve' ? 'Accept' : 'Decline'}
              </button>
            </div>
          </div>
        </div>
      )}

      {showDeactivateModal && deactivateTarget && (
        <div className="member-leadership-modal-overlay" onClick={cancelModal}>
          <div className="member-leadership-modal" onClick={(e) => e.stopPropagation()}>
            <div className="member-leadership-modal-header">
              <h3>Step Down from Position</h3>
              <button className="member-leadership-modal-close" onClick={cancelModal}>
                Close
              </button>
            </div>
            <div className="member-leadership-modal-body">
              <p>
                Are you sure you want to step down from the position of <strong>{getPositionName(deactivateTarget.positionId)}</strong>?
              </p>
              <p className="member-leadership-modal-warning">This action cannot be undone. You will lose access to leadership features.</p>
            </div>
            <div className="member-leadership-modal-actions">
              <button className="member-leadership-modal-cancel" onClick={cancelModal}>
                Cancel
              </button>
              <button
                className="member-leadership-modal-danger"
                onClick={confirmDeactivate}
                disabled={processingId !== null}
              >
                {processingId ? "Processing..." : "Step Down"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}