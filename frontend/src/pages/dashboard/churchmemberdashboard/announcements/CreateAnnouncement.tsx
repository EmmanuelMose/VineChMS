import { useState } from "react";
import { useSelector } from "react-redux";
import { createAnnouncement } from "../../../../Features/announcements/announcementsAPI";
import { FiX } from "react-icons/fi";
import "./CreateAnnouncement.css";

interface CreateAnnouncementProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function CreateAnnouncement({ isOpen, onClose, onSuccess }: CreateAnnouncementProps) {
  const token = useSelector((state: any) => state.user.token);
  const churchId = useSelector((state: any) => state.user.user?.churchId);

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    imageUrl: "",
    imagePublicId: "",
    imagePosition: "top",
    isPublished: false,
    expiresAt: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.checked });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const payload = {
        churchId: churchId!,
        title: formData.title,
        content: formData.content,
        imageUrl: formData.imageUrl || undefined,
        imagePublicId: formData.imagePublicId || undefined,
        imagePosition: formData.imagePosition,
        isPublished: formData.isPublished,
        expiresAt: formData.expiresAt || undefined,
      };

      await createAnnouncement(payload, token);
      onSuccess();
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to create announcement");
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="member-announcements-modal-overlay" onClick={onClose}>
      <div className="member-announcements-modal" onClick={(e) => e.stopPropagation()}>
        <div className="member-announcements-modal-header">
          <h3>Create Announcement</h3>
          <button onClick={onClose} className="member-announcements-modal-close">
            <FiX size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="member-announcements-modal-form">
          <div className="member-announcements-form-group">
            <label>Title *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Announcement title"
              required
            />
          </div>

          <div className="member-announcements-form-group">
            <label>Content *</label>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleChange}
              rows={4}
              placeholder="Announcement content..."
              required
            />
          </div>

          <div className="member-announcements-form-row">
            <div className="member-announcements-form-group">
              <label>Image URL</label>
              <input
                type="url"
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleChange}
                placeholder="https://example.com/image.jpg"
              />
            </div>
            <div className="member-announcements-form-group">
              <label>Image Position</label>
              <select
                name="imagePosition"
                value={formData.imagePosition}
                onChange={handleChange}
              >
                <option value="top">Top</option>
                <option value="bottom">Bottom</option>
                <option value="left">Left</option>
                <option value="right">Right</option>
                <option value="cover">Cover</option>
              </select>
            </div>
          </div>

          <div className="member-announcements-form-row">
            <div className="member-announcements-form-group">
              <label>Expires At</label>
              <input
                type="date"
                name="expiresAt"
                value={formData.expiresAt}
                onChange={handleChange}
              />
            </div>
            <div className="member-announcements-form-group">
              <label>Status</label>
              <div className="member-announcements-checkbox-group">
                <label>
                  <input
                    type="checkbox"
                    name="isPublished"
                    checked={formData.isPublished}
                    onChange={handleCheckboxChange}
                  />
                  Publish immediately
                </label>
              </div>
            </div>
          </div>

          {error && <div className="member-announcements-form-error">{error}</div>}

          <div className="member-announcements-modal-actions">
            <button type="button" onClick={onClose} className="member-announcements-modal-cancel">
              Cancel
            </button>
            <button type="submit" className="member-announcements-modal-submit" disabled={submitting}>
              {submitting ? "Creating..." : "Create Announcement"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}