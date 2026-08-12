import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { updateSermon, type Sermon } from "../../../../Features/sermons/sermonsAPI";
import { FiX } from "react-icons/fi";
import "./UpdateSermon.css";

interface UpdateSermonProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  sermon: Sermon;
}

export default function UpdateSermon({ isOpen, onClose, onSuccess, sermon }: UpdateSermonProps) {
  const token = useSelector((state: any) => state.user.token);

  const [formData, setFormData] = useState({
    title: "",
    speaker: "",
    topic: "",
    scripture: "",
    description: "",
    videoUrl: "",
    audioUrl: "",
    notes: "",
    preachedAt: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (sermon) {
      setFormData({
        title: sermon.title,
        speaker: sermon.speaker,
        topic: sermon.topic || "",
        scripture: sermon.scripture || "",
        description: sermon.description || "",
        videoUrl: sermon.videoUrl || "",
        audioUrl: sermon.audioUrl || "",
        notes: sermon.notes || "",
        preachedAt: new Date(sermon.preachedAt).toISOString().split("T")[0],
      });
    }
  }, [sermon]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const payload = {
        title: formData.title,
        speaker: formData.speaker,
        topic: formData.topic || undefined,
        scripture: formData.scripture || undefined,
        description: formData.description || undefined,
        videoUrl: formData.videoUrl || undefined,
        audioUrl: formData.audioUrl || undefined,
        notes: formData.notes || undefined,
        preachedAt: new Date(formData.preachedAt).toISOString(),
      };

      await updateSermon(sermon.sermonId, payload, token);
      onSuccess();
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to update sermon");
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="sermons-modal-overlay" onClick={onClose}>
      <div className="sermons-modal" onClick={(e) => e.stopPropagation()}>
        <div className="sermons-modal-header">
          <h3>Edit Sermon</h3>
          <button onClick={onClose} className="sermons-modal-close">
            <FiX size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="sermons-modal-form">
          <div className="sermons-form-row">
            <div className="sermons-form-group">
              <label>Title *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>
            <div className="sermons-form-group">
              <label>Speaker *</label>
              <input
                type="text"
                name="speaker"
                value={formData.speaker}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="sermons-form-row">
            <div className="sermons-form-group">
              <label>Topic</label>
              <input
                type="text"
                name="topic"
                value={formData.topic}
                onChange={handleChange}
              />
            </div>
            <div className="sermons-form-group">
              <label>Scripture</label>
              <input
                type="text"
                name="scripture"
                value={formData.scripture}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="sermons-form-group">
            <label>Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={2}
            />
          </div>

          <div className="sermons-form-row">
            <div className="sermons-form-group">
              <label>Video URL</label>
              <input
                type="url"
                name="videoUrl"
                value={formData.videoUrl}
                onChange={handleChange}
              />
            </div>
            <div className="sermons-form-group">
              <label>Audio URL</label>
              <input
                type="url"
                name="audioUrl"
                value={formData.audioUrl}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="sermons-form-row">
            <div className="sermons-form-group">
              <label>Preached Date *</label>
              <input
                type="date"
                name="preachedAt"
                value={formData.preachedAt}
                onChange={handleChange}
                required
              />
            </div>
            <div className="sermons-form-group">
              <label>Notes</label>
              <input
                type="text"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
              />
            </div>
          </div>

          {error && <div className="sermons-form-error">{error}</div>}

          <div className="sermons-modal-actions">
            <button type="button" onClick={onClose} className="sermons-modal-cancel">
              Cancel
            </button>
            <button type="submit" className="sermons-modal-submit" disabled={submitting}>
              {submitting ? "Updating..." : "Update Sermon"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}