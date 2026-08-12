import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { FiSearch, FiX, FiPlus, FiEdit2, FiTrash2, FiCalendar, FiUser, FiVideo, FiMusic, FiPlay } from "react-icons/fi";
import { fetchSermons, deleteSermon, type Sermon } from "../../../../Features/sermons/sermonsAPI";
import CreateSermon from "./CreateSermon";
import UpdateSermon from "./UpdateSermon";
import SermonViewer from "./SermonViewer";
import "./Sermons.css";

export default function Sermons() {
  const token = useSelector((state: any) => state.user.token);
  const churchId = useSelector((state: any) => state.user.user?.churchId);
  
  const [sermons, setSermons] = useState<Sermon[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [viewerOpen, setViewerOpen] = useState(false);
  const [selectedSermon, setSelectedSermon] = useState<Sermon | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);

  useEffect(() => {
    loadSermons();
  }, []);

  const loadSermons = async () => {
    try {
      setLoading(true);
      const data = await fetchSermons(token);
      const filtered = data.filter(s => s.churchId === churchId);
      setSermons(filtered);
    } catch (error) {
      console.error("Failed to load sermons:", error);
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
        await deleteSermon(deleteTargetId, token);
        await loadSermons();
        setShowDeleteModal(false);
        setDeleteTargetId(null);
      } catch (error) {
        console.error("Failed to delete sermon:", error);
      }
    }
  };

  const handleEdit = (sermon: Sermon) => {
    setSelectedSermon(sermon);
    setUpdateModalOpen(true);
  };

  const handlePlay = (sermon: Sermon) => {
    setSelectedSermon(sermon);
    setViewerOpen(true);
  };

  const handleSuccess = () => {
    loadSermons();
    setCreateModalOpen(false);
    setUpdateModalOpen(false);
    setSelectedSermon(null);
    setViewerOpen(false);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const filteredSermons = sermons.filter(sermon => {
    const matchesSearch = 
      sermon.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sermon.speaker.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (sermon.topic?.toLowerCase().includes(searchTerm.toLowerCase()) || false);
    return matchesSearch;
  });

  const stats = {
    total: sermons.length,
    withVideo: sermons.filter(s => s.videoUrl).length,
    withAudio: sermons.filter(s => s.audioUrl).length,
    withBoth: sermons.filter(s => s.videoUrl && s.audioUrl).length,
  };

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
      {showDeleteModal && (
        <div className="sermons-modal-overlay" onClick={() => setShowDeleteModal(false)}>
          <div className="sermons-modal sermons-modal-confirm" onClick={(e) => e.stopPropagation()}>
            <div className="sermons-modal-header">
              <h3>Delete Sermon</h3>
              <button onClick={() => setShowDeleteModal(false)} className="sermons-modal-close">
                <FiX size={20} />
              </button>
            </div>
            <div className="sermons-modal-body">
              <p>Are you sure you want to permanently delete this sermon?</p>
              <p className="sermons-modal-warning">This action cannot be undone.</p>
            </div>
            <div className="sermons-modal-actions">
              <button onClick={() => setShowDeleteModal(false)} className="sermons-btn-cancel">
                Cancel
              </button>
              <button onClick={confirmDelete} className="sermons-btn-danger">
                Delete Permanently
              </button>
            </div>
          </div>
        </div>
      )}

      <SermonViewer
        isOpen={viewerOpen}
        onClose={() => {
          setViewerOpen(false);
          setSelectedSermon(null);
        }}
        sermon={selectedSermon}
      />

      <div className="sermons-header">
        <div>
          <h2 className="sermons-title">Sermons</h2>
          <p className="sermons-subtitle">Manage sermon library and recordings</p>
        </div>
        <div className="sermons-actions">
          <button onClick={() => setCreateModalOpen(true)} className="sermons-btn-primary">
            <FiPlus size={16} />
            Add Sermon
          </button>
        </div>
      </div>

      <div className="sermons-stats-grid">
        <div className="sermons-stat-card stat-total">
          <span className="sermons-stat-value">{stats.total}</span>
          <span className="sermons-stat-label">Total Sermons</span>
        </div>
        <div className="sermons-stat-card stat-video">
          <span className="sermons-stat-value">{stats.withVideo}</span>
          <span className="sermons-stat-label">With Video</span>
        </div>
        <div className="sermons-stat-card stat-audio">
          <span className="sermons-stat-value">{stats.withAudio}</span>
          <span className="sermons-stat-label">With Audio</span>
        </div>
        <div className="sermons-stat-card stat-both">
          <span className="sermons-stat-value">{stats.withBoth}</span>
          <span className="sermons-stat-label">Both Available</span>
        </div>
      </div>

      <div className="sermons-toolbar">
        <div className="sermons-search">
          <FiSearch className="sermons-search-icon" />
          <input
            type="text"
            placeholder="Search sermons by title, speaker, or topic..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="sermons-search-input"
          />
          {searchTerm && (
            <button onClick={() => setSearchTerm("")} className="sermons-search-clear">
              <FiX size={16} />
            </button>
          )}
        </div>
      </div>

      <div className="sermons-grid">
        {filteredSermons.map((sermon) => (
          <div key={sermon.sermonId} className="sermons-card">
            <div className="sermons-card-content">
              <div className="sermons-card-header">
                <h3 className="sermons-card-title">{sermon.title}</h3>
                {sermon.videoUrl && sermon.audioUrl && (
                  <span className="sermons-card-badge-both">Both</span>
                )}
              </div>
              
              <div className="sermons-card-meta">
                <div className="sermons-card-meta-item">
                  <FiUser size={14} />
                  <span>{sermon.speaker}</span>
                </div>
                <div className="sermons-card-meta-item">
                  <FiCalendar size={14} />
                  <span>{formatDate(sermon.preachedAt)}</span>
                </div>
              </div>

              {sermon.topic && (
                <div className="sermons-card-topic">
                  <span className="sermons-card-topic-tag">{sermon.topic}</span>
                </div>
              )}

              {sermon.scripture && (
                <div className="sermons-card-scripture">
                  {sermon.scripture}
                </div>
              )}

              {sermon.description && (
                <p className="sermons-card-description">
                  {sermon.description}
                </p>
              )}

              <div className="sermons-card-media">
                {(sermon.videoUrl || sermon.audioUrl) && (
                  <button 
                    onClick={() => handlePlay(sermon)} 
                    className="sermons-card-play-btn"
                  >
                    <FiPlay size={16} />
                    {sermon.videoUrl && sermon.audioUrl ? 'Watch or Listen' : 
                     sermon.videoUrl ? 'Watch Sermon' : 'Listen to Sermon'}
                  </button>
                )}
                {sermon.videoUrl && (
                  <span className="sermons-card-media-tag video">
                    <FiVideo size={12} /> Video
                  </span>
                )}
                {sermon.audioUrl && (
                  <span className="sermons-card-media-tag audio">
                    <FiMusic size={12} /> Audio
                  </span>
                )}
              </div>

              <div className="sermons-card-footer">
                <div className="sermons-card-date">
                  <span>Added: {new Date(sermon.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="sermons-card-actions">
                  <button 
                    onClick={() => handleEdit(sermon)} 
                    className="sermons-card-btn sermons-btn-edit"
                  >
                    <FiEdit2 size={14} /> Edit
                  </button>
                  <button 
                    onClick={() => handleDeleteClick(sermon.sermonId)} 
                    className="sermons-card-btn sermons-btn-delete"
                  >
                    <FiTrash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
        {filteredSermons.length === 0 && (
          <div className="sermons-empty">
            <p>No sermons found. Start by adding your first sermon!</p>
          </div>
        )}
      </div>

      <CreateSermon
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSuccess={handleSuccess}
        churchId={churchId}
      />

      {selectedSermon && (
        <UpdateSermon
          isOpen={updateModalOpen}
          onClose={() => {
            setUpdateModalOpen(false);
            setSelectedSermon(null);
          }}
          onSuccess={handleSuccess}
          sermon={selectedSermon}
        />
      )}
    </div>
  );
}