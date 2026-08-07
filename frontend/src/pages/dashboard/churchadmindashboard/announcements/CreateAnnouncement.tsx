import { useState } from "react";
import { useSelector } from "react-redux";
import { FiX } from "react-icons/fi";
import { createAnnouncement } from "../../../../Features/announcements/announcementsAPI";
import "./CreateAnnouncement.css";

interface CreateAnnouncementProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  churchId?: number;
}

export default function CreateAnnouncement({ isOpen, onClose, onSuccess, churchId }: CreateAnnouncementProps) {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await createAnnouncement({
        churchId: Number(churchId),
        title: formData.title,
        content: formData.content,
        imageUrl: formData.imageUrl || undefined,
        imagePosition: formData.imagePosition,
        isPublished: formData.isPublished,
        expiresAt: formData.expiresAt || undefined,
      }, token);
      
      setFormData({
        title: "",
        content: "",
        imageUrl: "",
        imagePosition: "top",
        isPublished: false,
        expiresAt: "",
      });
      onSuccess();
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to create announcement");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="create-announcement-overlay" onClick={onClose}>
      <div className="create-announcement-modal" onClick={(e) => e.stopPropagation()}>
        <div className="create-announcement-header">
          <h3>Create Announcement</h3>
          <button onClick={onClose} className="create-announcement-close">
            <FiX size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="create-announcement-form">
          <div className="create-announcement-group">
            <label>Title *</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Enter announcement title"
              required
            />
          </div>
          <div className="create-announcement-group">
            <label>Content *</label>
            <textarea
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              placeholder="Enter announcement content"
              rows={4}
              required
            />
          </div>
          <div className="create-announcement-group">
            <label>Image URL</label>
            <input
              type="url"
              value={formData.imageUrl}
              onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
              placeholder="https://example.com/image.jpg"
            />
          </div>
          <div className="create-announcement-row">
            <div className="create-announcement-group">
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
            <div className="create-announcement-group">
              <label>Expires At</label>
              <input
                type="date"
                value={formData.expiresAt}
                onChange={(e) => setFormData({ ...formData, expiresAt: e.target.value })}
              />
            </div>
          </div>
          <div className="create-announcement-checkbox">
            <label className="create-announcement-checkbox-label">
              <input
                type="checkbox"
                checked={formData.isPublished}
                onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
              />
              Publish immediately
            </label>
          </div>
          {error && <div className="create-announcement-error">{error}</div>}
          <div className="create-announcement-actions">
            <button type="button" onClick={onClose} className="create-announcement-cancel">
              Cancel
            </button>
            <button type="submit" className="create-announcement-save" disabled={loading}>
              {loading ? "Creating..." : "Create Announcement"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}