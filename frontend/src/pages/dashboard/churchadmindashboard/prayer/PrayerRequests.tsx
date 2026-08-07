import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { FiSearch, FiX, FiPlus, FiEdit2, FiTrash2, FiHeart, FiEye, FiEyeOff, FiCalendar, FiUser } from "react-icons/fi";
import { fetchPrayerRequests, deletePrayerRequest, prayForRequest, type PrayerRequest } from "../../../../Features/prayer/PrayerAPI";
import { fetchMembers, type Member } from "../../../../Features/members/membersAPI";
import CreatePrayerRequest from "./CreatePrayerRequest";
import UpdatePrayerRequest from "./UpdatePrayerRequest";
import "./PrayerRequests.css";

export default function PrayerRequests() {
  const token = useSelector((state: any) => state.user.token);
  const churchId = useSelector((state: any) => state.user.user?.churchId);
  const userId = useSelector((state: any) => state.user.user?.userId);
  
  const [prayerRequests, setPrayerRequests] = useState<PrayerRequest[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [selectedPrayer, setSelectedPrayer] = useState<PrayerRequest | null>(null);
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterVisibility, setFilterVisibility] = useState("all");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);
  const [prayingId, setPrayingId] = useState<number | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [prayersData, membersData] = await Promise.all([
        fetchPrayerRequests(token),
        fetchMembers(token),
      ]);
      setPrayerRequests(prayersData);
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
        await deletePrayerRequest(deleteTargetId, token);
        await loadData();
        setShowDeleteModal(false);
        setDeleteTargetId(null);
      } catch (error) {
        console.error("Failed to delete prayer request:", error);
      }
    }
  };

  const handleEdit = (prayer: PrayerRequest) => {
    setSelectedPrayer(prayer);
    setUpdateModalOpen(true);
  };

  const handlePray = async (id: number) => {
    setPrayingId(id);
    try {
      await prayForRequest(id, userId!, token);
      await loadData();
    } catch (error) {
      console.error("Failed to pray for request:", error);
    } finally {
      setPrayingId(null);
    }
  };

  const handleSuccess = () => {
    loadData();
    setCreateModalOpen(false);
    setUpdateModalOpen(false);
    setSelectedPrayer(null);
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: "status-pending",
      praying: "status-praying",
      answered: "status-answered",
      closed: "status-closed",
    };
    return colors[status] || "status-pending";
  };

  const getVisibilityIcon = (visibility: string) => {
    if (visibility === "public") return <FiEye size={14} />;
    if (visibility === "private") return <FiEyeOff size={14} />;
    return <FiEyeOff size={14} />;
  };

  const getMemberName = (memberId: number) => {
    const member = members.find(m => m.memberId === memberId);
    return member ? member.fullName : "Unknown";
  };

  const filteredPrayers = prayerRequests.filter(prayer => {
    const matchesSearch = 
      prayer.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prayer.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = 
      filterStatus === "all" ||
      prayer.status === filterStatus;
    
    const matchesVisibility = 
      filterVisibility === "all" ||
      prayer.visibility === filterVisibility;
    
    return matchesSearch && matchesStatus && matchesVisibility;
  });

  const stats = {
    total: prayerRequests.length,
    pending: prayerRequests.filter(p => p.status === "pending").length,
    praying: prayerRequests.filter(p => p.status === "praying").length,
    answered: prayerRequests.filter(p => p.status === "answered").length,
    closed: prayerRequests.filter(p => p.status === "closed").length,
  };

  if (loading) {
    return (
      <div className="prayer-loading">
        <div className="prayer-loading-spinner"></div>
        <p>Loading prayer requests...</p>
      </div>
    );
  }

  return (
    <div className="prayer-page">
      {showDeleteModal && (
        <div className="prayer-modal-overlay" onClick={() => setShowDeleteModal(false)}>
          <div className="prayer-modal prayer-modal-confirm" onClick={(e) => e.stopPropagation()}>
            <div className="prayer-modal-header">
              <h3>Delete Prayer Request</h3>
              <button onClick={() => setShowDeleteModal(false)} className="prayer-modal-close">
                <FiX size={20} />
              </button>
            </div>
            <div className="prayer-modal-body">
              <p>Are you sure you want to permanently delete this prayer request?</p>
              <p className="prayer-modal-warning">This action cannot be undone.</p>
            </div>
            <div className="prayer-modal-actions">
              <button onClick={() => setShowDeleteModal(false)} className="prayer-btn-cancel">
                Cancel
              </button>
              <button onClick={confirmDelete} className="prayer-btn-danger">
                Delete Permanently
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="prayer-header">
        <div>
          <h2 className="prayer-title">Prayer Requests</h2>
          <p className="prayer-subtitle">Manage and pray for church prayer requests</p>
        </div>
        <div className="prayer-actions">
          <button onClick={() => setCreateModalOpen(true)} className="prayer-btn-primary">
            <FiPlus size={16} />
            New Request
          </button>
        </div>
      </div>

      <div className="prayer-stats-grid">
        <div className="prayer-stat-card stat-total">
          <span className="prayer-stat-value">{stats.total}</span>
          <span className="prayer-stat-label">Total</span>
        </div>
        <div className="prayer-stat-card stat-pending">
          <span className="prayer-stat-value">{stats.pending}</span>
          <span className="prayer-stat-label">Pending</span>
        </div>
        <div className="prayer-stat-card stat-praying">
          <span className="prayer-stat-value">{stats.praying}</span>
          <span className="prayer-stat-label">Praying</span>
        </div>
        <div className="prayer-stat-card stat-answered">
          <span className="prayer-stat-value">{stats.answered}</span>
          <span className="prayer-stat-label">Answered</span>
        </div>
        <div className="prayer-stat-card stat-closed">
          <span className="prayer-stat-value">{stats.closed}</span>
          <span className="prayer-stat-label">Closed</span>
        </div>
      </div>

      <div className="prayer-toolbar">
        <div className="prayer-search">
          <FiSearch className="prayer-search-icon" />
          <input
            type="text"
            placeholder="Search prayer requests..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="prayer-search-input"
          />
          {searchTerm && (
            <button onClick={() => setSearchTerm("")} className="prayer-search-clear">
              <FiX size={16} />
            </button>
          )}
        </div>
        <div className="prayer-filters">
          <select 
            value={filterStatus} 
            onChange={(e) => setFilterStatus(e.target.value)}
            className="prayer-filter-select"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="praying">Praying</option>
            <option value="answered">Answered</option>
            <option value="closed">Closed</option>
          </select>
          <select 
            value={filterVisibility} 
            onChange={(e) => setFilterVisibility(e.target.value)}
            className="prayer-filter-select"
          >
            <option value="all">All Visibility</option>
            <option value="public">Public</option>
            <option value="private">Private</option>
            <option value="confidential">Confidential</option>
          </select>
        </div>
      </div>

      <div className="prayer-grid">
        {filteredPrayers.map((prayer) => (
          <div key={prayer.prayerRequestId} className="prayer-card">
            <div className="prayer-card-header">
              <div className="prayer-card-title-section">
                <h3 className="prayer-card-title">{prayer.title}</h3>
                <span className={`prayer-card-status ${getStatusColor(prayer.status)}`}>
                  {prayer.status}
                </span>
              </div>
              <div className="prayer-card-visibility">
                {getVisibilityIcon(prayer.visibility)}
                <span>{prayer.visibility}</span>
              </div>
            </div>
            <p className="prayer-card-description">{prayer.description}</p>
            <div className="prayer-card-footer">
              <div className="prayer-card-meta">
                <span className="prayer-card-member">
                  <FiUser size={14} />
                  {getMemberName(prayer.memberId)}
                </span>
                <span className="prayer-card-date">
                  <FiCalendar size={14} />
                  {new Date(prayer.createdAt).toLocaleDateString()}
                </span>
                <span className="prayer-card-count">
                  <FiHeart size={14} />
                  {prayer.prayerCount} prayers
                </span>
              </div>
              <div className="prayer-card-actions">
                <button 
                  onClick={() => handlePray(prayer.prayerRequestId)} 
                  className="prayer-card-btn prayer-btn-pray"
                  disabled={prayingId === prayer.prayerRequestId}
                >
                  <FiHeart size={14} />
                  {prayingId === prayer.prayerRequestId ? "Praying..." : "Pray"}
                </button>
                <button 
                  onClick={() => handleEdit(prayer)} 
                  className="prayer-card-btn prayer-btn-edit"
                >
                  <FiEdit2 size={14} />
                </button>
                <button 
                  onClick={() => handleDeleteClick(prayer.prayerRequestId)} 
                  className="prayer-card-btn prayer-btn-delete"
                >
                  <FiTrash2 size={14} />
                </button>
              </div>
            </div>
          </div>
        ))}
        {filteredPrayers.length === 0 && (
          <div className="prayer-empty">
            <p>No prayer requests found</p>
          </div>
        )}
      </div>

      <CreatePrayerRequest
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSuccess={handleSuccess}
        churchId={churchId}
      />

      {selectedPrayer && (
        <UpdatePrayerRequest
          isOpen={updateModalOpen}
          onClose={() => {
            setUpdateModalOpen(false);
            setSelectedPrayer(null);
          }}
          onSuccess={handleSuccess}
          prayer={selectedPrayer}
        />
      )}
    </div>
  );
}