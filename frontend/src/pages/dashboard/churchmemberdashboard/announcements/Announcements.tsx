import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { FiSearch, FiX, FiCalendar, FiEye, FiEyeOff, FiEdit2, FiTrash2, FiPlus } from "react-icons/fi";
import { fetchAnnouncements, deleteAnnouncement, publishAnnouncement, unpublishAnnouncement, type Announcement } from "../../../../Features/announcements/announcementsAPI";
import CreateAnnouncement from "./CreateAnnouncement";
import UpdateAnnouncement from "./UpdateAnnouncement";
import "./Announcements.css";

export default function Announcements() {
  const token = useSelector((state: any) => state.user.token);
  const churchId = useSelector((state: any) => state.user.user?.churchId);
  const userRole = useSelector((state: any) => state.user.user?.role);
  
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [filteredAnnouncements, setFilteredAnnouncements] = useState<Announcement[]>([]);
  
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);

  const canManageAnnouncements = userRole === "elder" || userRole === "secretary" || userRole === "church_admin";

  useEffect(() => {
    loadAnnouncements();
  }, []);

  useEffect(() => {
    filterAnnouncements();
  }, [announcements, searchTerm, filterStatus, startDate, endDate]);

  const loadAnnouncements = async () => {
    try {
      setLoading(true);
      const data = await fetchAnnouncements(token);
      const churchAnnouncements = data.filter((a) => a.churchId === churchId);
      setAnnouncements(churchAnnouncements);
    } catch (error) {
      console.error("Failed to load announcements:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterAnnouncements = () => {
    let filtered = [...announcements];

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (a) =>
          a.title.toLowerCase().includes(term) ||
          a.content.toLowerCase().includes(term)
      );
    }

    if (filterStatus === "published") {
      filtered = filtered.filter((a) => a.isPublished);
    } else if (filterStatus === "draft") {
      filtered = filtered.filter((a) => !a.isPublished);
    }

    if (startDate) {
      const start = new Date(startDate);
      start.setHours(0, 0, 0, 0);
      filtered = filtered.filter((a) => new Date(a.createdAt) >= start);
    }

    if (endDate) {
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      filtered = filtered.filter((a) => new Date(a.createdAt) <= end);
    }

    setFilteredAnnouncements(filtered);
  };

  const clearDateFilters = () => {
    setStartDate("");
    setEndDate("");
  };

  const handleEdit = (announcement: Announcement) => {
    setEditingAnnouncement(announcement);
    setShowUpdateModal(true);
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
        alert("Failed to delete announcement.");
      }
    }
  };

  const handlePublish = async (id: number) => {
    try {
      await publishAnnouncement(id, token);
      await loadAnnouncements();
    } catch (error) {
      console.error("Failed to publish announcement:", error);
      alert("Failed to publish announcement.");
    }
  };

  const handleUnpublish = async (id: number) => {
    try {
      await unpublishAnnouncement(id, token);
      await loadAnnouncements();
    } catch (error) {
      console.error("Failed to unpublish announcement:", error);
      alert("Failed to unpublish announcement.");
    }
  };

  const handleSuccess = () => {
    loadAnnouncements();
    setShowCreateModal(false);
    setShowUpdateModal(false);
    setEditingAnnouncement(null);
  };

  if (loading) {
    return (
      <div className="member-announcements-loading">
        <div className="member-announcements-loading-spinner"></div>
        <p>Loading announcements...</p>
      </div>
    );
  }

  const hasActiveFilters = !!(searchTerm || filterStatus !== "all" || startDate || endDate);

  return (
    <div className="member-announcements-page">
      <CreateAnnouncement
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={handleSuccess}
      />

      {editingAnnouncement && (
        <UpdateAnnouncement
          isOpen={showUpdateModal}
          onClose={() => {
            setShowUpdateModal(false);
            setEditingAnnouncement(null);
          }}
          onSuccess={handleSuccess}
          announcement={editingAnnouncement}
        />
      )}

      {showDeleteModal && (
        <div className="member-announcements-modal-overlay" onClick={() => setShowDeleteModal(false)}>
          <div className="member-announcements-modal" onClick={(e) => e.stopPropagation()}>
            <div className="member-announcements-modal-header">
              <h3>Delete Announcement</h3>
              <button className="member-announcements-modal-close" onClick={() => setShowDeleteModal(false)}>
                Close
              </button>
            </div>
            <div className="member-announcements-modal-body">
              <p>Are you sure you want to delete this announcement?</p>
              <p className="member-announcements-modal-warning">This action cannot be undone.</p>
            </div>
            <div className="member-announcements-modal-actions">
              <button className="member-announcements-modal-cancel" onClick={() => setShowDeleteModal(false)}>
                Cancel
              </button>
              <button className="member-announcements-modal-danger" onClick={confirmDelete}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="member-announcements-header">
        <div>
          <h2 className="member-announcements-title">Announcements</h2>
          <p className="member-announcements-subtitle">Stay updated with church news</p>
        </div>
        {canManageAnnouncements && (
          <button className="member-announcements-add-btn" onClick={() => setShowCreateModal(true)}>
            <FiPlus size={18} />
            New Announcement
          </button>
        )}
      </div>

      <div className="member-announcements-toolbar">
        <div className="member-announcements-search">
          <FiSearch className="member-announcements-search-icon" />
          <input
            type="text"
            placeholder="Search announcements..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="member-announcements-search-input"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="member-announcements-search-clear"
            >
              <FiX size={16} />
            </button>
          )}
        </div>
        <div className="member-announcements-filters">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="member-announcements-filter-select"
          >
            <option value="all">All</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>
        </div>
      </div>

      <div className="member-announcements-date-filters">
        <div className="member-announcements-date-group">
          <label>From Date</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="member-announcements-date-input"
          />
        </div>
        <div className="member-announcements-date-group">
          <label>To Date</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="member-announcements-date-input"
          />
        </div>
        {(startDate || endDate) && (
          <button
            onClick={clearDateFilters}
            className="member-announcements-clear-filters"
          >
            Clear Dates
          </button>
        )}
      </div>

      <div className="member-announcements-grid">
        {filteredAnnouncements.length > 0 ? (
          filteredAnnouncements.map((announcement) => (
            <div key={announcement.announcementId} className="member-announcements-card">
              {announcement.imageUrl && (
                <div className="member-announcements-card-image">
                  <img src={announcement.imageUrl} alt={announcement.title} />
                </div>
              )}
              <div className="member-announcements-card-content">
                <div className="member-announcements-card-header">
                  <h3 className="member-announcements-card-title">{announcement.title}</h3>
                  <span
                    className={`member-announcements-card-status ${
                      announcement.isPublished ? "status-published" : "status-draft"
                    }`}
                  >
                    {announcement.isPublished ? (
                      <>
                        <FiEye size={12} /> Published
                      </>
                    ) : (
                      <>
                        <FiEyeOff size={12} /> Draft
                      </>
                    )}
                  </span>
                </div>
                <p className="member-announcements-card-description">
                  {announcement.content}
                </p>
                <div className="member-announcements-card-footer">
                  <div className="member-announcements-card-date">
                    <FiCalendar size={14} />
                    <span>{new Date(announcement.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="member-announcements-card-actions">
                    {canManageAnnouncements && (
                      <>
                        {announcement.isPublished ? (
                          <button
                            className="member-announcements-btn-unpublish"
                            onClick={() => handleUnpublish(announcement.announcementId)}
                          >
                            Unpublish
                          </button>
                        ) : (
                          <button
                            className="member-announcements-btn-publish"
                            onClick={() => handlePublish(announcement.announcementId)}
                          >
                            Publish
                          </button>
                        )}
                        <button
                          className="member-announcements-btn-edit"
                          onClick={() => handleEdit(announcement)}
                        >
                          <FiEdit2 size={14} /> Edit
                        </button>
                        <button
                          className="member-announcements-btn-delete"
                          onClick={() => handleDeleteClick(announcement.announcementId)}
                        >
                          <FiTrash2 size={14} /> Delete
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="member-announcements-empty">
            <p>No announcements found</p>
          </div>
        )}
      </div>

      {filteredAnnouncements.length > 0 && (
        <div className="member-announcements-count">
          Showing {filteredAnnouncements.length} of {announcements.length} announcements
          {hasActiveFilters && " (filtered)"}
        </div>
      )}
    </div>
  );
}