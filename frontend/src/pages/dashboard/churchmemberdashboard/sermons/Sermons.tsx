import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { fetchSermons, deleteSermon, type Sermon } from "../../../../Features/sermons/sermonsAPI";
import CreateSermon from "./CreateSermon";
import UpdateSermon from "./UpdateSermon";
import SermonViewer from "../../churchadmindashboard/sermons/SermonViewer";
import "./Sermons.css";

export default function Sermons() {
  const token = useSelector((state: any) => state.user.token);
  const churchId = useSelector((state: any) => state.user.user?.churchId);
  const userRole = useSelector((state: any) => state.user.user?.role);
  
  const [sermons, setSermons] = useState<Sermon[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterSpeaker, setFilterSpeaker] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [filteredSermons, setFilteredSermons] = useState<Sermon[]>([]);
  const [viewerOpen, setViewerOpen] = useState(false);
  const [selectedSermon, setSelectedSermon] = useState<Sermon | null>(null);
  
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [editingSermon, setEditingSermon] = useState<Sermon | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);

  const canManageSermons = userRole === "pastor" || userRole === "elder" || userRole === "church_admin";

  useEffect(() => {
    loadSermons();
  }, []);

  useEffect(() => {
    filterSermons();
  }, [sermons, searchTerm, filterSpeaker, startDate, endDate]);

  const loadSermons = async () => {
    try {
      setLoading(true);
      const data = await fetchSermons(token);
      const churchSermons = data.filter((s) => s.churchId === churchId);
      setSermons(churchSermons);
    } catch (error) {
      console.error("Failed to load sermons:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterSermons = () => {
    let filtered = [...sermons];

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (s) =>
          s.title.toLowerCase().includes(term) ||
          s.speaker.toLowerCase().includes(term) ||
          (s.topic || "").toLowerCase().includes(term) ||
          (s.scripture || "").toLowerCase().includes(term)
      );
    }

    if (filterSpeaker.trim()) {
      const speaker = filterSpeaker.toLowerCase();
      filtered = filtered.filter((s) =>
        s.speaker.toLowerCase().includes(speaker)
      );
    }

    if (startDate) {
      const start = new Date(startDate);
      start.setHours(0, 0, 0, 0);
      filtered = filtered.filter((s) => new Date(s.preachedAt) >= start);
    }

    if (endDate) {
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      filtered = filtered.filter((s) => new Date(s.preachedAt) <= end);
    }

    setFilteredSermons(filtered);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setFilterSpeaker("");
    setStartDate("");
    setEndDate("");
  };

  const handlePlay = (sermon: Sermon) => {
    setSelectedSermon(sermon);
    setViewerOpen(true);
  };

  const handleEdit = (sermon: Sermon) => {
    setEditingSermon(sermon);
    setShowUpdateModal(true);
  };

  const handleDeleteClick = (id: number) => {
    setDeleteTargetId(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (deleteTargetId) {
      try {
        await deleteSermon(deleteTargetId, token);
        await loadSermons();
        setShowDeleteModal(false);
        setDeleteTargetId(null);
      } catch (error) {
        console.error("Failed to delete sermon:", error);
        alert("Failed to delete sermon.");
      }
    }
  };

  const handleSuccess = () => {
    loadSermons();
    setShowCreateModal(false);
    setShowUpdateModal(false);
    setEditingSermon(null);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const hasActiveFilters = !!(searchTerm || filterSpeaker || startDate || endDate);

  if (loading) {
    return (
      <div className="sermons-loading">
        <div className="sermons-loading-spinner"></div>
        <p>Loading sermons...</p>
      </div>
    );
  }

  return (
    <div className="sermons-page">
      <SermonViewer
        isOpen={viewerOpen}
        onClose={() => {
          setViewerOpen(false);
          setSelectedSermon(null);
        }}
        sermon={selectedSermon}
      />

      <CreateSermon
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={handleSuccess}
      />

      {editingSermon && (
        <UpdateSermon
          isOpen={showUpdateModal}
          onClose={() => {
            setShowUpdateModal(false);
            setEditingSermon(null);
          }}
          onSuccess={handleSuccess}
          sermon={editingSermon}
        />
      )}

      {showDeleteModal && (
        <div className="sermons-modal-overlay" onClick={() => setShowDeleteModal(false)}>
          <div className="sermons-modal" onClick={(e) => e.stopPropagation()}>
            <div className="sermons-modal-header">
              <h3>Delete Sermon</h3>
              <button className="sermons-modal-close" onClick={() => setShowDeleteModal(false)}>
                Close
              </button>
            </div>
            <div className="sermons-modal-body">
              <p>Are you sure you want to delete this sermon?</p>
              <p className="sermons-modal-warning">This action cannot be undone.</p>
            </div>
            <div className="sermons-modal-actions">
              <button className="sermons-modal-cancel" onClick={() => setShowDeleteModal(false)}>
                Cancel
              </button>
              <button className="sermons-modal-danger" onClick={confirmDelete}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="sermons-header">
        <div>
          <h2 className="sermons-title">Sermons</h2>
          <p className="sermons-subtitle">Watch and listen to church sermons</p>
        </div>
        {canManageSermons && (
          <button className="sermons-new-btn" onClick={() => setShowCreateModal(true)}>
            New Sermon
          </button>
        )}
      </div>

      <div className="sermons-filters">
        <div className="sermons-filter-group">
          <label>Search</label>
          <input
            type="text"
            placeholder="Title, topic, or scripture..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="sermons-filter-group">
          <label>Speaker</label>
          <input
            type="text"
            placeholder="Filter by speaker..."
            value={filterSpeaker}
            onChange={(e) => setFilterSpeaker(e.target.value)}
          />
        </div>
        <div className="sermons-filter-group">
          <label>From</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>
        <div className="sermons-filter-group">
          <label>To</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
        {hasActiveFilters && (
          <button className="sermons-clear-btn" onClick={clearFilters}>
            Clear Filters
          </button>
        )}
      </div>

      <div className="sermons-grid">
        {filteredSermons.length > 0 ? (
          filteredSermons.map((sermon) => (
            <div key={sermon.sermonId} className="sermons-card">
              <div className="sermons-card-content">
                <h3 className="sermons-card-title">{sermon.title}</h3>
                <div className="sermons-card-meta">
                  <span className="sermons-card-speaker">{sermon.speaker}</span>
                  <span className="sermons-card-date">{formatDate(sermon.preachedAt)}</span>
                </div>
                {sermon.topic && (
                  <div className="sermons-card-topic">{sermon.topic}</div>
                )}
                {sermon.scripture && (
                  <div className="sermons-card-scripture">{sermon.scripture}</div>
                )}
                {sermon.description && (
                  <p className="sermons-card-description">{sermon.description}</p>
                )}
                <div className="sermons-card-actions">
                  <div className="sermons-card-buttons">
                    {(sermon.videoUrl || sermon.audioUrl) && (
                      <button
                        className="sermons-play-btn"
                        onClick={() => handlePlay(sermon)}
                      >
                        Play
                      </button>
                    )}
                    {canManageSermons && (
                      <>
                        <button
                          className="sermons-edit-btn"
                          onClick={() => handleEdit(sermon)}
                        >
                          Edit
                        </button>
                        <button
                          className="sermons-delete-btn"
                          onClick={() => handleDeleteClick(sermon.sermonId)}
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </div>
                  <div className="sermons-tags">
                    {sermon.videoUrl && <span className="tag-video">Video</span>}
                    {sermon.audioUrl && <span className="tag-audio">Audio</span>}
                    {sermon.videoUrl && sermon.audioUrl && (
                      <span className="tag-both">Both</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="sermons-empty">
            <p>No sermons found</p>
            <span>Try adjusting your search or filters</span>
          </div>
        )}
      </div>

      {filteredSermons.length > 0 && (
        <div className="sermons-count">
          Showing {filteredSermons.length} of {sermons.length} sermons
          {hasActiveFilters && " (filtered)"}
        </div>
      )}
    </div>
  );
}