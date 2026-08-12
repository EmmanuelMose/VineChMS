import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { updatePrayerRequest, type PrayerRequest } from "../../../../Features/prayer/PrayerAPI";
import "./UpdatePrayerRequest.css";

interface UpdatePrayerRequestProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  prayer: PrayerRequest | null;
}

export default function UpdatePrayerRequest({
  isOpen,
  onClose,
  onSuccess,
  prayer,
}: UpdatePrayerRequestProps) {
  const token = useSelector((state: any) => state.user.token);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [visibility, setVisibility] = useState("public");
  const [status, setStatus] = useState("pending");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (prayer) {
      setTitle(prayer.title);
      setDescription(prayer.description);
      setVisibility(prayer.visibility);
      setStatus(prayer.status);
    }
  }, [prayer]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prayer) return;
    setSubmitting(true);
    try {
      await updatePrayerRequest(
        prayer.prayerRequestId,
        {
          title,
          description,
          visibility,
          status,
        },
        token
      );
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Failed to update prayer request:", error);
      alert("Failed to update prayer request. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen || !prayer) return null;

  return (
    <div className="update-prayer-overlay" onClick={onClose}>
      <div className="update-prayer-modal" onClick={(e) => e.stopPropagation()}>
        <div className="update-prayer-header">
          <h3>Edit Prayer Request</h3>
          <button className="update-prayer-close" onClick={onClose}>
            Close
          </button>
        </div>
        <form onSubmit={handleSubmit} className="update-prayer-form">
          <div className="update-prayer-group">
            <label>Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className="update-prayer-group">
            <label>Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              required
            />
          </div>
          <div className="update-prayer-group">
            <label>Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
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
              value={visibility}
              onChange={(e) => setVisibility(e.target.value)}
            >
              <option value="public">Public</option>
              <option value="private">Private</option>
              <option value="confidential">Confidential</option>
            </select>
          </div>
          <div className="update-prayer-actions">
            <button type="button" className="update-prayer-cancel" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="update-prayer-submit" disabled={submitting}>
              {submitting ? "Updating..." : "Update Request"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}