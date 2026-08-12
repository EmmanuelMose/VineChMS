import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { fetchPrayerRequests, deletePrayerRequest, prayForRequest, type PrayerRequest } from "../../../../Features/prayer/PrayerAPI";
import { fetchMemberByUserId } from "../../../../Features/members/membersAPI";
import CreatePrayerRequest from "./CreatePrayerRequest";
import UpdatePrayerRequest from "./UpdatePrayerRequest";
import "./PrayerRequests.css";

export default function PrayerRequests() {
  const token = useSelector((state: any) => state.user.token);
  const churchId = useSelector((state: any) => state.user.user?.churchId);
  const userId = useSelector((state: any) => state.user.user?.userId);

  const [prayerRequests, setPrayerRequests] = useState<PrayerRequest[]>([]);
  const [memberId, setMemberId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [filteredRequests, setFilteredRequests] = useState<PrayerRequest[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingPrayer, setEditingPrayer] = useState<PrayerRequest | null>(null);
  const [fetchError, setFetchError] = useState("");
  const [prayingIds, setPrayingIds] = useState<Set<number>>(new Set());

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
    filterRequests();
  }, [prayerRequests, searchTerm, filterStatus, startDate, endDate]);

  const loadData = async () => {
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      setFetchError("");
      const prayersData = await fetchPrayerRequests(token);
      const churchPrayers = prayersData.filter((p) => p.churchId === churchId);
      setPrayerRequests(churchPrayers);
    } catch (error: any) {
      console.error("Failed to load data:", error);
      setFetchError(error.message || "Failed to load prayer requests");
    } finally {
      setLoading(false);
    }
  };

  const filterRequests = () => {
    let filtered = [...prayerRequests];

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.title.toLowerCase().includes(term) ||
          p.description.toLowerCase().includes(term)
      );
    }

    if (filterStatus !== "all") {
      filtered = filtered.filter((p) => p.status === filterStatus);
    }

    if (startDate) {
      const start = new Date(startDate);
      start.setHours(0, 0, 0, 0);
      filtered = filtered.filter((p) => new Date(p.createdAt) >= start);
    }

    if (endDate) {
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      filtered = filtered.filter((p) => new Date(p.createdAt) <= end);
    }

    if (memberId) {
      filtered = filtered.filter((p) => {
        if (p.visibility === "public") return true;
        if (p.memberId === memberId) return true;
        return false;
      });
    } else {
      filtered = filtered.filter((p) => p.visibility === "public");
    }

    setFilteredRequests(filtered);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setFilterStatus("all");
    setStartDate("");
    setEndDate("");
  };

  const isOwner = (prayer: PrayerRequest) => {
    return prayer.memberId === memberId;
  };

  const handlePray = async (prayerId: number) => {
    if (!memberId) {
      alert("You need to be logged in to pray.");
      return;
    }

    setPrayingIds(prev => new Set(prev).add(prayerId));

    try {
      const result = await prayForRequest(prayerId, memberId, token);
      if (result) {
        await loadData();
      }
    } catch (error: any) {
      console.error("Failed to pray:", error);
      let errorMessage = "Failed to pray. Please try again.";

      if (error.response) {
        const data = error.response.data;
        if (data && data.message) {
          errorMessage = data.message;
        } else if (data && data.error) {
          errorMessage = data.error;
        } else {
          errorMessage = error.response.statusText || "Server error";
        }
      } else if (error.request) {
        errorMessage = "No response from server. Please check your connection.";
      } else {
        errorMessage = error.message || "An error occurred.";
      }

      if (
        errorMessage.toLowerCase().includes("already") ||
        errorMessage.toLowerCase().includes("duplicate") ||
        errorMessage.toLowerCase().includes("exists") ||
        errorMessage.toLowerCase().includes("unique")
      ) {
        alert("You have already prayed for this request.");
      } else {
        alert(errorMessage);
      }
    } finally {
      setPrayingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(prayerId);
        return newSet;
      });
    }
  };

  const handleDelete = async (prayerId: number) => {
    if (!window.confirm("Are you sure you want to delete this prayer request?")) return;
    try {
      await deletePrayerRequest(prayerId, token);
      await loadData();
    } catch (error) {
      console.error("Failed to delete prayer request:", error);
      alert("Failed to delete the prayer request.");
    }
  };

  const handleEdit = (prayer: PrayerRequest) => {
    setEditingPrayer(prayer);
    setShowEditModal(true);
  };

  const handleSuccess = () => {
    loadData();
    setShowCreateModal(false);
    setShowEditModal(false);
    setEditingPrayer(null);
  };

  const getStatusClass = (status: string) => {
    const classes: Record<string, string> = {
      pending: "status-pending",
      praying: "status-praying",
      answered: "status-answered",
      closed: "status-closed",
    };
    return classes[status] || "status-pending";
  };

  const hasActiveFilters = !!(searchTerm || filterStatus !== "all" || startDate || endDate);

  if (loading) {
    return (
      <div className="prayer-loading">
        <div className="prayer-loading-spinner"></div>
        <p>Loading prayer requests...</p>
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className="prayer-error">
        <p>Error loading prayer requests: {fetchError}</p>
        <button onClick={loadData} className="prayer-retry-btn">Retry</button>
      </div>
    );
  }

  return (
    <div className="prayer-page">
      <div className="prayer-header">
        <div>
          <h2 className="prayer-title">Prayer Requests</h2>
          <p className="prayer-subtitle">Share your prayer needs and pray for others</p>
        </div>
        <button className="prayer-new-btn" onClick={() => setShowCreateModal(true)}>
          New Request
        </button>
      </div>

      <div className="prayer-filters">
        <div className="prayer-filter-group">
          <label>Search</label>
          <input
            type="text"
            placeholder="Search by title or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="prayer-filter-group">
          <label>Status</label>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">All</option>
            <option value="pending">Pending</option>
            <option value="praying">Praying</option>
            <option value="answered">Answered</option>
            <option value="closed">Closed</option>
          </select>
        </div>
        <div className="prayer-filter-group">
          <label>From</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>
        <div className="prayer-filter-group">
          <label>To</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
        {hasActiveFilters && (
          <button className="prayer-clear-btn" onClick={clearFilters}>
            Clear Filters
          </button>
        )}
      </div>

      <div className="prayer-grid">
        {filteredRequests.length > 0 ? (
          filteredRequests.map((prayer) => {
            const owned = isOwner(prayer);
            const isPraying = prayingIds.has(prayer.prayerRequestId);
            return (
              <div key={prayer.prayerRequestId} className="prayer-card">
                <div className="prayer-card-header">
                  <h3 className="prayer-card-title">{prayer.title}</h3>
                  <span className={`prayer-card-status ${getStatusClass(prayer.status)}`}>
                    {prayer.status}
                  </span>
                </div>
                <p className="prayer-card-description">{prayer.description}</p>
                <div className="prayer-card-meta">
                  <span className="prayer-card-author">{prayer.fullName || "Anonymous"}</span>
                  <span className="prayer-card-date">
                    {new Date(prayer.createdAt).toLocaleDateString()}
                  </span>
                  <span className="prayer-card-count">{prayer.prayerCount} prayers</span>
                  <span className="prayer-card-visibility">{prayer.visibility}</span>
                </div>
                <div className="prayer-card-actions">
                  <button
                    className="prayer-pray-btn"
                    onClick={() => handlePray(prayer.prayerRequestId)}
                    disabled={isPraying}
                  >
                    {isPraying ? "Praying..." : "Pray"}
                  </button>
                  {owned && (
                    <>
                      <button
                        className="prayer-edit-btn"
                        onClick={() => handleEdit(prayer)}
                      >
                        Edit
                      </button>
                      <button
                        className="prayer-delete-btn"
                        onClick={() => handleDelete(prayer.prayerRequestId)}
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
          <div className="prayer-empty">
            <p>No prayer requests found</p>
            <span>Be the first to share a prayer request</span>
          </div>
        )}
      </div>

      {filteredRequests.length > 0 && (
        <div className="prayer-count">
          Showing {filteredRequests.length} of {prayerRequests.length} requests
          {hasActiveFilters && " (filtered)"}
        </div>
      )}

      <CreatePrayerRequest
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={handleSuccess}
        churchId={churchId}
        memberId={memberId ?? undefined}
      />

      <UpdatePrayerRequest
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        onSuccess={handleSuccess}
        prayer={editingPrayer}
      />
    </div>
  );
}