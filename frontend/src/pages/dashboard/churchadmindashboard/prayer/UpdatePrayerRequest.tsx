import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { FiX } from "react-icons/fi";
import { updatePrayerRequest, type PrayerRequest } from "../../../../Features/prayer/PrayerAPI";
import "./UpdatePrayerRequest.css";

interface UpdatePrayerRequestProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  prayer: PrayerRequest;
}

export default function UpdatePrayerRequest({ isOpen, onClose, onSuccess, prayer }: UpdatePrayerRequestProps) {
  const token = useSelector((state: any) => state.user.token);
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "pending",
    visibility: "public",
    image: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (prayer) {
      setFormData({
        title: prayer.title,
        description: prayer.description,
        status: prayer.status,
        visibility: prayer.visibility,
        image: prayer.image || "",
      });
    }
  }, [prayer]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await updatePrayerRequest(prayer.prayerRequestId, {
        title: formData.title,
        description: formData.description,
        status: formData.status,
        visibility: formData.visibility,
        image: formData.image || undefined,
      }, token);
      onSuccess();
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to update prayer request");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="update-prayer-overlay" onClick={onClose}>
      <div className="update-prayer-modal" onClick={(e) => e.stopPropagation()}>
        <div className="update-prayer-header">
          <h3>Edit Prayer Request</h3>
          <button onClick={onClose} className="update-prayer-close">
            <FiX size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="update-prayer-form">
          <div className="update-prayer-group">
            <label>Title *</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>
          <div className="update-prayer-group">
            <label>Description *</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              required
            />
          </div>
          <div className="update-prayer-row">
            <div className="update-prayer-group">
              <label>Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              >
                <option value="pending">Pending</option>
                <option value="praying">Praying</option>
                <option value="answered">Answered</option>
                <option value="closed">Closed</option>
              </select>
            </div>
            <div className="update-prayer-group">
              <label>Visibility</label>
              <select
                value={formData.visibility}
                onChange={(e) => setFormData({ ...formData, visibility: e.target.value })}
              >
                <option value="public">Public</option>
                <option value="private">Private</option>
                <option value="confidential">Confidential</option>
              </select>
            </div>
          </div>
          <div className="update-prayer-group">
            <label>Image URL (Optional)</label>
            <input
              type="url"
              value={formData.image}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
            />
          </div>
          {error && <div className="update-prayer-error">{error}</div>}
          <div className="update-prayer-actions">
            <button type="button" onClick={onClose} className="update-prayer-cancel">
              Cancel
            </button>
            <button type="submit" className="update-prayer-save" disabled={loading}>
              {loading ? "Updating..." : "Update Prayer Request"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}