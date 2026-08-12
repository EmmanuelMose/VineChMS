import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { FiSearch, FiX, FiPlus, FiEdit2, FiTrash2, FiEye, FiEyeOff, FiCalendar } from "react-icons/fi";
import { fetchAnnouncements, deleteAnnouncement, publishAnnouncement, unpublishAnnouncement, type Announcement } from "../../../../Features/announcements/announcementsAPI";
import CreateAnnouncement from "./CreateAnnouncement";
import UpdateAnnouncement from "./UpdateAnnouncement";
import "./Announcements.css";

export default function Announcements() {
  const token = useSelector((state: any) => state.user.token);
  const churchId = useSelector((state: any) => state.user.user?.churchId);
  
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null);
  const [filterStatus, setFilterStatus] = useState("all");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);

  useEffect(() => {
    loadAnnouncements();
  }, []);

  const loadAnnouncements = async () => {
    try {
      setLoading(true);
      const data = await fetchAnnouncements(token);
      const filtered = data.filter(a => a.churchId === churchId);
      setAnnouncements(filtered);
    } catch (error) {
      console.error("Failed to load announcements:", error);
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
        await deleteAnnouncement(deleteTargetId, token);
        await loadAnnouncements();
        setShowDeleteModal(false);
        setDeleteTargetId(null);
      } catch (error) {
        console.error("Failed to delete announcement:", error);
      }
    }
  };

  const handleEdit = (announcement: Announcement) => {
    setSelectedAnnouncement(announcement);
    setUpdateModalOpen(true);
  };

  const handlePublish = async (id: number) => {
    try {
      await publishAnnouncement(id, token);
      await loadAnnouncements();
    } catch (error) {
      console.error("Failed to publish announcement:", error);
    }
  };

  const handleUnpublish = async (id: number) => {
    try {
      await unpublishAnnouncement(id, token);
      await loadAnnouncements();
    } catch (error) {
      console.error("Failed to unpublish announcement:", error);
    }
  };

  const handleSuccess = () => {
    loadAnnouncements();
    setCreateModalOpen(false);
    setUpdateModalOpen(false);
    setSelectedAnnouncement(null);
  };

  const getStatusColor = (isPublished: boolean) => {
    return isPublished ? "status-published" : "status-draft";
  };

  const filteredAnnouncements = announcements.filter(announcement => {
    const matchesSearch = 
      announcement.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      announcement.content.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = 
      filterStatus === "all" ||
      (filterStatus === "published" && announcement.isPublished) ||
      (filterStatus === "draft" && !announcement.isPublished);
    
    return matchesSearch && matchesFilter;
  });

  const stats = {
    total: announcements.length,
    published: announcements.filter(a => a.isPublished).length,
    draft: announcements.filter(a => !a.isPublished).length,
  };

  if (loading) {
    return (
      <div className="announcements-loading">
        <div className="announcements-loading-spinner"></div>
        <p>Loading announcements...</p>
      </div>
    );
  }

  return (
    <div className="announcements-page">
      {showDeleteModal && (
        <div className="announcements-modal-overlay" onClick={() => setShowDeleteModal(false)}>
          <div className="announcements-modal announcements-modal-confirm" onClick={(e) => e.stopPropagation()}>
            <div className="announcements-modal-header">
              <h3>Delete Announcement</h3>
              <button onClick={() => setShowDeleteModal(false)} className="announcements-modal-close">
                <FiX size={20} />
              </button>
            </div>
            <div className="announcements-modal-body">
              <p>Are you sure you want to permanently delete this announcement?</p>
              <p className="announcements-modal-warning">This action cannot be undone.</p>
            </div>
            <div className="announcements-modal-actions">
              <button onClick={() => setShowDeleteModal(false)} className="announcements-btn-cancel">
                Cancel
              </button>
              <button onClick={confirmDelete} className="announcements-btn-danger">
                Delete Permanently
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="announcements-header">
        <div>
          <h2 className="announcements-title">Announcements</h2>
          <p className="announcements-subtitle">Manage church announcements and updates</p>
        </div>
        <div className="announcements-actions">
          <button onClick={() => setCreateModalOpen(true)} className="announcements-btn-primary">
            <FiPlus size={16} />
            Create Announcement
          </button>
        </div>
      </div>

      <div className="announcements-stats-grid">
        <div className="announcements-stat-card stat-total">
          <span className="announcements-stat-value">{stats.total}</span>
          <span className="announcements-stat-label">Total</span>
        </div>
        <div className="announcements-stat-card stat-published">
          <span className="announcements-stat-value">{stats.published}</span>
          <span className="announcements-stat-label">Published</span>
        </div>
        <div className="announcements-stat-card stat-draft">
          <span className="announcements-stat-value">{stats.draft}</span>
          <span className="announcements-stat-label">Drafts</span>
        </div>
      </div>

      <div className="announcements-toolbar">
        <div className="announcements-search">
          <FiSearch className="announcements-search-icon" />
          <input
            type="text"
            placeholder="Search announcements..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="announcements-search-input"
          />
          {searchTerm && (
            <button onClick={() => setSearchTerm("")} className="announcements-search-clear">
              <FiX size={16} />
            </button>
          )}
        </div>
        <div className="announcements-filters">
          <select 
            value={filterStatus} 
            onChange={(e) => setFilterStatus(e.target.value)}
            className="announcements-filter-select"
          >
            <option value="all">All</option>
            <option value="published">Published</option>
            <option value="draft">Drafts</option>
          </select>
        </div>
      </div>

      <div className="announcements-grid">
        {filteredAnnouncements.map((announcement) => (
          <div key={announcement.announcementId} className="announcements-card">
            {announcement.imageUrl && (
              <div className="announcements-card-image">
                <img src={announcement.imageUrl} alt={announcement.title} />
              </div>
            )}
            <div className="announcements-card-content">
              <div className="announcements-card-header">
                <h3 className="announcements-card-title">{announcement.title}</h3>
                <span className={`announcements-card-status ${getStatusColor(announcement.isPublished)}`}>
                  {announcement.isPublished ? "Published" : "Draft"}
                </span>
              </div>
              <p className="announcements-card-description">
                {announcement.content}
              </p>
              <div className="announcements-card-footer">
                <div className="announcements-card-date">
                  <FiCalendar size={14} />
                  <span>{new Date(announcement.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="announcements-card-actions">
                  {announcement.isPublished ? (
                    <button 
                      onClick={() => handleUnpublish(announcement.announcementId)} 
                      className="announcements-card-btn announcements-btn-unpublish"
                      title="Unpublish"
                    >
                      <FiEyeOff size={14} />
                      Unpublish
                    </button>
                  ) : (
                    <button 
                      onClick={() => handlePublish(announcement.announcementId)} 
                      className="announcements-card-btn announcements-btn-publish"
                      title="Publish"
                    >
                      <FiEye size={14} />
                      Publish
                    </button>
                  )}
                  <button 
                    onClick={() => handleEdit(announcement)} 
                    className="announcements-card-btn announcements-btn-edit"
                  >
                    <FiEdit2 size={14} />
                  </button>
                  <button 
                    onClick={() => handleDeleteClick(announcement.announcementId)} 
                    className="announcements-card-btn announcements-btn-delete"
                  >
                    <FiTrash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
        {filteredAnnouncements.length === 0 && (
          <div className="announcements-empty">
            <p>No announcements found</p>
          </div>
        )}
      </div>

      <CreateAnnouncement
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSuccess={handleSuccess}
        churchId={churchId}
      />

      {selectedAnnouncement && (
        <UpdateAnnouncement
          isOpen={updateModalOpen}
          onClose={() => {
            setUpdateModalOpen(false);
            setSelectedAnnouncement(null);
          }}
          onSuccess={handleSuccess}
          announcement={selectedAnnouncement}
        />
      )}
    </div>
  );
}