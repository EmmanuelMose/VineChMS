import { useState } from "react";
import { useSelector } from "react-redux";
import { createPrayerRequest } from "../../../../Features/prayer/PrayerAPI";
import "./CreatePrayerRequest.css";

interface CreatePrayerRequestProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  churchId?: number;
  memberId?: number;
}

export default function CreatePrayerRequest({
  isOpen,
  onClose,
  onSuccess,
  churchId,
  memberId,
}: CreatePrayerRequestProps) {
  const token = useSelector((state: any) => state.user.token);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [visibility, setVisibility] = useState("public");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!memberId || !churchId) return;
    setSubmitting(true);
    try {
      await createPrayerRequest(
        {
          churchId: churchId,
          memberId: memberId,
          title,
          description,
          status: "pending",
          visibility,
        },
        token
      );
      setTitle("");
      setDescription("");
      setVisibility("public");
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Failed to create prayer request:", error);
      alert("Failed to create prayer request. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="create-prayer-overlay" onClick={onClose}>
      <div className="create-prayer-modal" onClick={(e) => e.stopPropagation()}>
        <div className="create-prayer-header">
          <h3>New Prayer Request</h3>
          <button className="create-prayer-close" onClick={onClose}>
            Close
          </button>
        </div>
        <form onSubmit={handleSubmit} className="create-prayer-form">
          <div className="create-prayer-group">
            <label>Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Prayer request title"
              required
            />
          </div>
          <div className="create-prayer-group">
            <label>Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your prayer request"
              rows={4}
              required
            />
          </div>
          <div className="create-prayer-group">
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
          <div className="create-prayer-actions">
            <button type="button" className="create-prayer-cancel" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="create-prayer-submit" disabled={submitting}>
              {submitting ? "Submitting..." : "Submit Request"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}