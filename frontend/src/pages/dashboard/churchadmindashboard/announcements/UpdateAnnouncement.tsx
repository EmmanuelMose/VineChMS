import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { FiX } from "react-icons/fi";
import { updateAnnouncement, type Announcement } from "../../../../Features/announcements/announcementsAPI";
import "./UpdateAnnouncement.css";

interface UpdateAnnouncementProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  announcement: Announcement;
}

export default function UpdateAnnouncement({ isOpen, onClose, onSuccess, announcement }: UpdateAnnouncementProps) {
  const token = useSelector((state: any) => state.user.token);
  
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    imageUrl: "",
    imagePosition: "top",
    isPublished: false,
    expiresAt: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (announcement) {
      setFormData({
        title: announcement.title,
        content: announcement.content,
        imageUrl: announcement.imageUrl || "",
        imagePosition: announcement.imagePosition || "top",
        isPublished: announcement.isPublished,
        expiresAt: announcement.expiresAt ? announcement.expiresAt.split("T")[0] : "",
      });
    }
  }, [announcement]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await updateAnnouncement(announcement.announcementId, {
        title: formData.title,
        content: formData.content,
        imageUrl: formData.imageUrl || undefined,
        imagePosition: formData.imagePosition,
        isPublished: formData.isPublished,
        expiresAt: formData.expiresAt || undefined,
      }, token);
      onSuccess();
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to update announcement");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="update-announcement-overlay" onClick={onClose}>
      <div className="update-announcement-modal" onClick={(e) => e.stopPropagation()}>
        <div className="update-announcement-header">
          <h3>Edit Announcement</h3>
          <button onClick={onClose} className="update-announcement-close">
            <FiX size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="update-announcement-form">
          <div className="update-announcement-group">
            <label>Title *</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>
          <div className="update-announcement-group">
            <label>Content *</label>
            <textarea
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              rows={4}
              required
            />
          </div>
          <div className="update-announcement-group">
            <label>Image URL</label>
            <input
              type="url"
              value={formData.imageUrl}
              onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
            />
          </div>
          <div className="update-announcement-row">
            <div className="update-announcement-group">
              <label>Image Position</label>
              <select
                value={formData.imagePosition}
                onChange={(e) => setFormData({ ...formData, imagePosition: e.target.value })}
              >
                <option value="top">Top</option>
                <option value="bottom">Bottom</option>
                <option value="left">Left</option>
                <option value="right">Right</option>
                <option value="cover">Cover</option>
              </select>
            </div>
            <div className="update-announcement-group">
              <label>Expires At</label>
              <input
                type="date"
                value={formData.expiresAt}
                onChange={(e) => setFormData({ ...formData, expiresAt: e.target.value })}
              />
            </div>
          </div>
          <div className="update-announcement-checkbox">
            <label className="update-announcement-checkbox-label">
              <input
                type="checkbox"
                checked={formData.isPublished}
                onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
              />
              Published
            </label>
          </div>
          {error && <div className="update-announcement-error">{error}</div>}
          <div className="update-announcement-actions">
            <button type="button" onClick={onClose} className="update-announcement-cancel">
              Cancel
            </button>
            <button type="submit" className="update-announcement-save" disabled={loading}>
              {loading ? "Updating..." : "Update Announcement"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}